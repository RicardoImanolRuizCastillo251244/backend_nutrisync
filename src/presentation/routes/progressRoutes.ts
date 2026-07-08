import { Router } from "express";
import { ProgressController } from "../controllers/ProgressController";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { validateBody } from "../middlewares/validate";
import { logProgressSchema } from "../validators/progressValidators";

const router = Router();
router.use(requireAuth);

/**
 * @swagger
 * /v1/progress:
 *   post:
 *     summary: Log weight progress (patient only)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [weightKg]
 *             properties:
 *               weightKg:
 *                 type: number
 *               heightCm:
 *                 type: number
 *     responses:
 *       201:
 *         description: Progress logged
 */
router.post("/", requireRole("patient"), validateBody(logProgressSchema), ProgressController.log);

/**
 * @swagger
 * /v1/progress/my-history:
 *   get:
 *     summary: Get my progress history (patient only)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Progress history
 */
router.get("/my-history", requireRole("patient"), ProgressController.getMyHistory);

/**
 * @swagger
 * /v1/progress/patient/{patientUserId}:
 *   get:
 *     summary: Get patient progress history (nutritionist only)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientUserId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Progress history
 */
router.get("/patient/:patientUserId", requireRole("nutritionist"), ProgressController.getPatientHistory);

export default router;