import auth from './authen.js'
import user from './user.js'
import defalut from './defalut.js'

const routers = [
    {
        prefix : '/api',
        route : auth
    },
    {
        prefix : '/api/users',
        route : user
    }
]

export default [...routers, {
    prefix : '*',
    route : defalut
}]