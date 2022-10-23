import express from "express"
const router = express.Router()
import { authenticateUser } from "../middleware/authentication"
import {  getAllClasses, getClassById, filterClasses, enrollUser, unEnrollUser, rateClass, commentClass } from "../controllers/user.controller"

router.get('/all-classes', getAllClasses)
router.get('/classes/:id', getClassById)
router.get('/classes', filterClasses)
router.post('/enroll/:id', authenticateUser, enrollUser)
router.post('/unenroll/:id', authenticateUser, unEnrollUser)
router.post('/rate-class/:id', authenticateUser, rateClass)
router.post('/comment-class/:id', authenticateUser, commentClass)

export { router as userRouter }