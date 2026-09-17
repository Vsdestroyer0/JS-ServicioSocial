import { Router } from "express";
import { login, registrar, getUser, logout } from "../controller/authController.js";
import { reqRol } from "../middleware/authMiddleware.js";

const router = Router();

router.get('/usuario', reqRol(1,2), getUser)
router.post('/registro', registrar);
router.post('/login', login)
router.post('/logout', logout)

export default router;