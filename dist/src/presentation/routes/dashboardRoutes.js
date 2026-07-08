"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/dashboard:
 *   get:
 *     summary: Get nutritionist dashboard with KPIs
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPatients:
 *                   type: number
 *                 activePlans:
 *                   type: number
 *                 avgAdherence:
 *                   type: number
 *                 recentActivity:
 *                   type: array
 *                 patientsWithLowAdherence:
 *                   type: array
 */
router.get("/", authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"), DashboardController_1.DashboardController.get);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map