// Load env variables
import './src/loadEnv.ts'

import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import session from 'express-session'

import moviesRouter from './routes/moviesRouter.ts'
import authRouter from './routes/authRouter.ts'

var app = express()
app.use(cors())
app.use(logger('dev'))
app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000, // milliseconds
    },
  }),
)

// Limit JSON response sizes in case of very large movie objects.
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./public'))

app.use('/api/movies', moviesRouter)
app.use('/api/user', authRouter)

export default app
