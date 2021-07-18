import { Model } from 'tspace-orm'
import User from './User.js'
class OauthAccessToken extends Model {
    constructor(){
        super()  
        this.belongsTo({ model : User ,name :'user' })
    }
}

export default OauthAccessToken
