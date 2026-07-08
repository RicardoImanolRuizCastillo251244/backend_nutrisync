"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const validate_1 = require("../middlewares/validate");
const authValidators_1 = require("../validators/authValidators");
const router = (0, express_1.Router)();
router.post("/login", (0, validate_1.validateBody)(authValidators_1.loginSchema), AuthController_1.AuthController.login);
router.post("/register", (0, validate_1.validateBody)(authValidators_1.registerSchema), AuthController_1.AuthController.register);
router.post("/refresh", (0, validate_1.validateBody)(authValidators_1.refreshSchema), AuthController_1.AuthController.refresh);
router.post("/logout", (0, validate_1.validateBody)(authValidators_1.logoutSchema), AuthController_1.AuthController.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map