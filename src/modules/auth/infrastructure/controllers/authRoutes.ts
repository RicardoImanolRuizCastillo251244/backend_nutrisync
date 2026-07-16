import { Router } from "express";
import { AuthController } from "@/modules/auth/infrastructure/controllers/AuthController";
import { validateBody } from "@/presentation/middlewares/validate";
import { loginSchema, registerSchema } from "@/modules/auth/infrastructure/dtos/AuthDto";

const router = Router();

router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/register", validateBody(registerSchema), AuthController.register);

export default router;