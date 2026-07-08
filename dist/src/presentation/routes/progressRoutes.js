"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProgressController_1 = require("../controllers/ProgressController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const validate_1 = require("../middlewares/validate");
const progressValidators_1 = require("../validators/progressValidators");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
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
router.post("/", (0, requireRole_1.requireRole)("patient"), (0, validate_1.validateBody)(progressValidators_1.logProgressSchema), ProgressController_1.ProgressController.log);
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
router.get("/my-history", (0, requireRole_1.requireRole)("patient"), ProgressController_1.ProgressController.getMyHistory);
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
router.get("/patient/:patientUserId", (0, requireRole_1.requireRole)("nutritionist"), ProgressController_1.ProgressController.getPatientHistory);
exports.default = router;
//# sourceMappingURL=progressRoutes.js.map