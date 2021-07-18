import jwt from 'jsonwebtoken'
import env from '../../config/env.js'

export const encodeJwt = (data) => {
    const accessToken =  jwt.sign({
       data
      }, env.JWT_SECRET , { expiresIn: env.JWT_EXPIRE_HOUR });
    return accessToken  
}

export const decodeJwt = (token) => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return decoded
    } catch (err) {
        throw { message : err.message , code : 400 }
    }
}
