"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("@/modules/auth/infrastructure/controllers/AuthController");
const validate_1 = require("@/presentation/middlewares/validate");
const AuthDto_1 = require("@/modules/auth/infrastructure/dtos/AuthDto");
const router = (0, express_1.Router)();
router.post("/login", (0, validate_1.validateBody)(AuthDto_1.loginSchema), AuthController_1.AuthController.login);
router.post("/register", (0, validate_1.validateBody)(AuthDto_1.registerSchema), AuthController_1.AuthController.register);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map