"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardController_1 = require("../../../../modules/dashboard/infrastructure/controllers/DashboardController");
const authMiddleware_1 = require("../../../../presentation/middlewares/authMiddleware");
const requireRole_1 = require("../../../../presentation/middlewares/requireRole");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"));
router.get("/nutritionist", DashboardController_1.DashboardController.getNutritionistDashboard);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map