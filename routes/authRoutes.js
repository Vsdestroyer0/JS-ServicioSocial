import { Router } from "express";
import { login, registrar, getUser } from "../controller/authController.js";

const router = Router();

router.get('/usuario', getUser)
router.post('/registro', registrar);
router.post('/login', login)

export default router;