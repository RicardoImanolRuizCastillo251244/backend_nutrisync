import { Router } from "express";
import { AdherenceController } from "../controllers/AdherenceController";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { requirePatientOwnership } from "../middlewares/requirePatientOwnership";
import { validateBody } from "../middlewares/validate";
import { logMealSchema, logHydrationSchema, logMoodSchema } from "../validators/adherenceValidators";

const router = Router();
router.use(requireAuth);

// Patient-only endpoints
/**
 * @swagger
 * /v1/adherence/meals:
 *   post:
 *     summary: Log a meal (patient only)
 *     tags: [Adherence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mealName, date]
 *             properties:
 *               planId:
 *                 type: string
 *               mealName:
 *                 type: string
 *               date:
 *                 type: string
 *               consumed:
 *                 type: boolean
 *               consumedAt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Meal logged
 */
router.post("/meals", requireRole("patient"), validateBody(logMealSchema), AdherenceController.logMeal);

/**
 * @swagger
 * /v1/adherence/hydration:
 *   post:
 *     summary: Log hydration intake (patient only)
 *     tags: [Adherence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amountMl]
 *             properties:
 *               amountMl:
 *                 type: number
 *     responses:
 *       201:
 *         description: Hydration logged
 */
router.post("/hydration", requireRole("patient"), validateBody(logHydrationSchema), AdherenceController.logHydration);

/**
 * @swagger
 * /v1/adherence/mood:
 *   post:
 *     summary: Log mood (patient only)
 *     tags: [Adherence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mood]
 *             properties:
 *               mood:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mood logged
 */
router.post("/mood", requireRole("patient"), validateBody(logMoodSchema), AdherenceController.logMood);

// Nutritionist access to patient summary
/**
 * @swagger
 * /v1/adherence/summary/{patientId}:
 *   get:
 *     summary: Get adherence summary for a patient (nutritionist only)
 *     tags: [Adherence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Adherence summary
 */
router.get("/summary/:patientId", requireRole("nutritionist"), AdherenceController.getSummaryForNutritionist);

// Patient own summary
/**
 * @swagger
 * /v1/adherence/my-summary:
 *   get:
 *     summary: Get my own adherence summary (patient only)
 *     tags: [Adherence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: My adherence summary
 */
router.get("/my-summary", requireRole("patient"), AdherenceController.getMySummary);

export default router;