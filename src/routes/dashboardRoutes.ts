import express from "express"
const router = express.Router()
import { authenticateUser } from "../middleware/authentication"

import { createClass } from "../controllers/dashboard.controller"

router.post('/create-class', createClass)

export { router as dashboardRouter }