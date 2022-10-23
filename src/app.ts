import * as path from 'path';
import express from 'express';
import { connectDB } from "./db/connect"
require('dotenv').config({ path: __dirname+'/config/.env' });

import cookieParser from "cookie-parser"
import cors from "cors"
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
app.set('trust proxy', 1);

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/dashboard', dashboardRouter)
app.use('/api/v1/user', userRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 8080

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();