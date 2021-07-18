import express from 'express'
import * as AuthController from '../app/Http/Controllers/Auth/AuthLoginController.js'
import AuthMiddleware from '../app/Http/Middlewares/AuthMiddleware.js'

const router = express.Router()
router.post('/login', AuthController.login)
router.post('/register',AuthController.register)
router.delete('/logout', AuthMiddleware ,AuthController.logout)

export default router