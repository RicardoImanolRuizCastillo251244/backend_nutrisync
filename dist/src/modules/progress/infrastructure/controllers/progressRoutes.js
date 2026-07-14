"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProgressController_1 = require("../../../../modules/progress/infrastructure/controllers/ProgressController");
const authMiddleware_1 = require("../../../../presentation/middlewares/authMiddleware");
const requireRole_1 = require("../../../../presentation/middlewares/requireRole");
const validate_1 = require("../../../../presentation/middlewares/validate");
const LogProgressDto_1 = require("../../../../modules/progress/infrastructure/dtos/LogProgressDto");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.post("/", (0, requireRole_1.requireRole)("patient"), (0, validate_1.validateBody)(LogProgressDto_1.logProgressSchema), ProgressController_1.ProgressController.log);
router.get("/my-history", (0, requireRole_1.requireRole)("patient"), ProgressController_1.ProgressController.getMyHistory);
router.get("/patient/:patientUserId", (0, requireRole_1.requireRole)("nutritionist"), ProgressController_1.ProgressController.getPatientHistory);
exports.default = router;
//# sourceMappingURL=progressRoutes.js.map