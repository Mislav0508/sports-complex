import express from "express"
const router = express.Router()
import { authenticateUser, authorizePermissions } from "../middleware/authentication"

import { createClass, updateClass, deleteClass, createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/dashboard.controller"

// Classes
router.post('/create-class', authenticateUser, authorizePermissions("admin"), createClass)
router.put('/update-class/:id', authenticateUser, authorizePermissions("admin"), updateClass)
router.delete('/delete-class/:id', authenticateUser, authorizePermissions("admin"), deleteClass)

// Users
router.post('/create-user', authenticateUser, authorizePermissions("admin"), createUser)
router.get('/all-users', authenticateUser, authorizePermissions("admin"), getAllUsers)
router.get('/user/:id', authenticateUser, authorizePermissions("admin"), getUserById)
router.put('/update-user/:id', authenticateUser, authorizePermissions("admin"), updateUser)
router.delete('/delete-user/:id', authenticateUser, authorizePermissions("admin"), deleteUser)

export { router as dashboardRouter }