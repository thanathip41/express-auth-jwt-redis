import express from 'express'
const router = express.Router()

router.use(((req, res,next) => {
    return res.status(404).json({
      success : false,
      message: 'Page Not Found'
    })
}))

export default router