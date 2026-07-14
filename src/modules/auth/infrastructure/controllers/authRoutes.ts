import { Router } from "express";
import { AuthController } from "@/modules/auth/infrastructure/controllers/AuthController";
import { validateBody } from "@/presentation/middlewares/validate";
import { loginSchema } from "@/modules/auth/infrastructure/dtos/AuthDto";

const router = Router();

router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/register", validateBody(loginSchema), AuthController.register);

export default router;