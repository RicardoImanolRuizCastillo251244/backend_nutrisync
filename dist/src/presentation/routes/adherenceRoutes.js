"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdherenceController_1 = require("../controllers/AdherenceController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const validate_1 = require("../middlewares/validate");
const adherenceValidators_1 = require("../validators/adherenceValidators");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
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
router.post("/meals", (0, requireRole_1.requireRole)("patient"), (0, validate_1.validateBody)(adherenceValidators_1.logMealSchema), AdherenceController_1.AdherenceController.logMeal);
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
router.post("/hydration", (0, requireRole_1.requireRole)("patient"), (0, validate_1.validateBody)(adherenceValidators_1.logHydrationSchema), AdherenceController_1.AdherenceController.logHydration);
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
router.post("/mood", (0, requireRole_1.requireRole)("patient"), (0, validate_1.validateBody)(adherenceValidators_1.logMoodSchema), AdherenceController_1.AdherenceController.logMood);
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
router.get("/summary/:patientId", (0, requireRole_1.requireRole)("nutritionist"), AdherenceController_1.AdherenceController.getSummaryForNutritionist);
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
router.get("/my-summary", (0, requireRole_1.requireRole)("patient"), AdherenceController_1.AdherenceController.getMySummary);
exports.default = router;
//# sourceMappingURL=adherenceRoutes.js.map