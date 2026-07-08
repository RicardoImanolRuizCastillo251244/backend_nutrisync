import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateBody } from "../middlewares/validate";
import { loginSchema, registerSchema, logoutSchema, refreshSchema } from "../validators/authValidators";

const router = Router();

router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/refresh", validateBody(refreshSchema), AuthController.refresh);
router.post("/logout", validateBody(logoutSchema), AuthController.logout);

export default router;
