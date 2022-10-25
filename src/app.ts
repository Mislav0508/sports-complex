import * as path from 'path';
import express from 'express';
import { connectDB } from "./db/connect"
require('dotenv').config({ path: __dirname+'/config/.env' });

import cookieParser from "cookie-parser"
import cors from "cors"
import rateLimiter from "express-rate-limit"
import helmet from "helmet"
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize"
import { authRouter } from "./routes/authRoutes"
import { dashboardRouter } from "./routes/dashboardRoutes"
import { userRouter } from "./routes/userRoutes"

const app = express()

// middleware
app.use(express.static(path.join(__dirname, '../../public')))
import notFoundMiddleware from "./middleware/not-found"
import errorHandlerMiddleware from "./middleware/error-handler"

// cors
const corsOptions = {
  origin:'*', 
  credentials:true,           
  optionSuccessStatus:200
}
app.use(cors(corsOptions))
app.set('trust proxy', 1)

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/dashboard', dashboardRouter)
app.use('/api/v1/user', userRouter)

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB("mongodb://mongo:27017/sports-complex-node")
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error);
  }
}

start()