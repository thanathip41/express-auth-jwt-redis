import { Validate , Validator } from 'tspace-validator'
import { encodeJwt } from '../../../Utils/index.js'
import bcrypt from 'bcryptjs'
import env from '../../../../config/env.js'
import redis from '../../../Providers/redis/index.js'
import { BadRequest, Unauthorized } from '../../../Exceptions/index.js'

// ## Model
import User from '../../../Models/User.js'
import OauthAccessToken from '../../../Models/OauthAccessToken.js'

export const login = async (req, res,next) => {
  try {
    new Validator().check(req.body, { 
      email : new Validate().required().email(),
      password : new Validate().required()
    })
    const { email , password } = req.body
    const user = await new User()
            .where('email',email)
            .first()

    if(!user) return BadRequest()

    const match = await bcrypt.compare(password, user.password)

    if(!match) return Unauthorized()
    delete user.password

    let accessToken

    switch (env.REDIS_USED) {
      case true: 
        accessToken = encodeJwt(user.id)
        const cached = await redis.get('accessTokens')
        const currentCached = JSON.parse(cached) || []
        const data = { accessToken, user }
        const newCached = [...currentCached ,data]
        const TIME = +env.REDIS_TIME

        await redis.setex('accessTokens',TIME,JSON.stringify(newCached))

        break;
    
      default: 
        const oauth = await new OauthAccessToken()
        .create({
          scopes : JSON.stringify([]),
          user_id : user.id,
          revoked : 0
        }).save()
        accessToken = encodeJwt(oauth.id)
      break;
    }

    return res
      .json({
        success : true,
        user,
        access_token : accessToken
    })

  } catch (err) {
    return next(err)
  }
}

export const register = async (req, res,next) => {
    try {
        new Validator().check(req.body, { 
            name : new Validate().required(),  
            email :  new Validate().required().email(), 
            password : new Validate().required() ,
        })
   
        const { name , email , password } = req.body

        const hash = bcrypt.hashSync(password, 5)

        const user = await new User()
            .where('email',email)
            .createNotExists({ 
                name , 
                email , 
                password: hash
            }).save()

        if(!user) return BadRequest()

        let accessToken

        switch (env.REDIS_USED) {
            case true: 
                accessToken = encodeJwt(user.id)
                const cached = await redis.get('accessTokens')
                const currentCached = JSON.parse(cached) || []
                const data = { accessToken, user }
                const newCached = [...currentCached ,data]
                const TIME = +env.REDIS_TIME

                await redis.setex('accessTokens',TIME,JSON.stringify(newCached))

                break;
            
            default: 
                const oauth = await new OauthAccessToken().create({
                    scopes : JSON.stringify([]),
                    user_id : user.id,
                    revoked : 0
                }).save()
        
                accessToken = encodeJwt(oauth.id)
            break;
        }

        return res.json({
            success : true,
            user,
            access_token : accessToken
        })
    } 
    catch (err) {
     next(err)
    }
}

export const logout = async (req, res , next) => {
    try {
      const oauthAccessToken = req.oauthAccessToken
      switch (env.REDIS_USED) {
        case true: {
          const cached = await redis.get('accessTokens')
          if(!cached) return res.status(204).json()
          const currentCached = JSON.parse(cached) || []
          const TIME = +env.REDIS_TIME
          const newCached = currentCached.filter(data => data.accessToken !== oauthAccessToken)
        
          await redis.setex('accessTokens',TIME,JSON.stringify(newCached))
          return res.status(204).json()
        }
        default: {
          const deleted = await new OauthAccessToken()
            .update({
                revoked : true
            })
            .where('id',oauthAccessToken)
            .save()
            
          if(!deleted) return BadRequest('invalid authorization token')
  
          return res.status(204).json()
        }
      }
    } 
    catch (err) {
      return next(err)
    }
}