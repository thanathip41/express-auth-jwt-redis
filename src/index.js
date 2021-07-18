import express from 'express'
import path from 'path'
import logger from 'morgan'
import cors from 'cors'
import helmet from "helmet"
import nocache from 'nocache'
import env from './config/env.js'
import { networkInterfaces } from 'os'
import http from 'http'
import ErrorMiddleware from './app/Http/Middlewares/ErrorMiddleware.js'
import routers from './routes/index.js'
import compression from 'compression'

const app = express()
app.use(compression())
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(path.join(path.resolve(),'src/public')))
app.use(nocache())
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.set('trust proxy',true)

routers.forEach(router => {
  app.use(router.prefix ?? '/' , router.route)
})

app.use(ErrorMiddleware)
const port = +env.PORT || 8000
app.set('port', port)

const server = http.createServer(app)
const getLocalNetwork = () => {
  try {
    return Object
        .values(networkInterfaces())
        .map(data => data)
        .shift()
        .filter(details => details?.family === 'IPv4' && !details?.internal)
        .pop()?.address

  } catch(err) {
    return 'localhost'
  }
}

server.listen(port , () => {

  console.log(`\n\x1b[1m\x1b[34m app start ${env.NODE_ENV} mode : on
  Local http://localhost:${port}
  Network http://${getLocalNetwork()}:${port}
  `)
})