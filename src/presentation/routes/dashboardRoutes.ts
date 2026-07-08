import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

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
router.get("/", requireAuth, requireRole("nutritionist"), DashboardController.get);

export default router;