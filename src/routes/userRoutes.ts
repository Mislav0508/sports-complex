import express from "express"
const router = express.Router()
import {  getAllClasses, getClassById, filterClasses, enrollUser, unEnrollUser } from "../controllers/user.controller"

router.get('/all-classes', getAllClasses)
router.get('/classes/:id', getClassById)
router.get('/classes', filterClasses)
router.post('/enroll/:id', enrollUser)
router.post('/unenroll/:id', unEnrollUser)

export { router as userRouter }