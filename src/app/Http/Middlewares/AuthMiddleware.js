import OauthAccessToken from '../../Models/OauthAccessToken.js'
import { decodeJwt } from '../../Utils/index.js'
import { Unauthorized , BadRequest } from '../../Exceptions/index.js'
import env from '../../../config/env.js'
import redis from '../../Providers/redis/index.js'

export default async (req, res, next) => {
  try {
    const [bearer , token] = req.headers.authorization?.split(' ') ?? []
    
    if(!["bearer","Bearer"].includes(bearer) || token ==  null) return BadRequest('Required Bearer Token')

    switch (env.REDIS_USED) {
      case true:{
        const cached = await redis.get('accessTokens')
          if(!cached) return Unauthorized()
            const currentCached = JSON.parse(cached)
            const userCached = currentCached.find(data => data.accessToken === token)
            const user = userCached ? userCached.user : null
  
            if(user == null) return Unauthorized()
              req.authUser = user
              req.oauthAccessToken = token
            return next()
      }
      default: {
        const decode = decodeJwt(token)
        const oauth = await new OauthAccessToken()
                  .with('user')
                  .where('revoked',false)
                  .first('id',decode.data)

        if(oauth?.user == null) return Unauthorized()

          req.authUser = oauth.user
          req.oauthAccessToken = oauth.id

        return next()
      }
    }

  } catch (err) {
    return next(err)
  }
}