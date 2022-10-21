import express from "express"
const router = express.Router()
import { authenticateUser } from "../middleware/authentication"

import { register, login, logout, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller"

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout );
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export { router as authRouter }