import express from "express"
const router = express.Router()
import { authenticateUser, authorizePermissions } from "../middleware/authentication"

import { createClass } from "../controllers/dashboard.controller"

router.post('/create-class', authenticateUser, authorizePermissions("admin"), createClass)

export { router as dashboardRouter }