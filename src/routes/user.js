import express from 'express'
import AuthMiddleware from '../app/Http/Middlewares/AuthMiddleware.js'
import * as UserController from '../app/Http/Controllers/User/UserController.js'

const router = express.Router()
router.get('/profile',  AuthMiddleware ,UserController.index)

export default router