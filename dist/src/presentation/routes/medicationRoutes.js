"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MedicationController_1 = require("../controllers/MedicationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const requirePatientOwnership_1 = require("../middlewares/requirePatientOwnership");
const validate_1 = require("../middlewares/validate");
const medicationValidators_1 = require("../validators/medicationValidators");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("patient"), requirePatientOwnership_1.requirePatientOwnership);
/**
 * @swagger
 * /v1/medications:
 *   post:
 *     summary: Create a medication (patient only)
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, dosage, times, days]
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: string
 *               reminderEnabled:
 *                 type: boolean
 *               times:
 *                 type: array
 *                 items:
 *                   type: string
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *               intervalHours:
 *                 type: number
 *     responses:
 *       201:
 *         description: Medication created
 *       403:
 *         description: Nutritionists cannot access medications
 *   get:
 *     summary: List my medications (patient only)
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of medications
 */
router.post("/", (0, validate_1.validateBody)(medicationValidators_1.createMedicationSchema), MedicationController_1.MedicationController.create);
router.get("/", MedicationController_1.MedicationController.list);
/**
 * @swagger
 * /v1/medications/{id}:
 *   get:
 *     summary: Get medication by ID
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medication
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update medication
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete medication
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get("/:id", MedicationController_1.MedicationController.getById);
router.patch("/:id", (0, validate_1.validateBody)(medicationValidators_1.updateMedicationSchema), MedicationController_1.MedicationController.update);
router.delete("/:id", MedicationController_1.MedicationController.remove);
/**
 * @swagger
 * /v1/medications/{id}/takes:
 *   post:
 *     summary: Log a medication take
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Take logged
 *   get:
 *     summary: List medication takes
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of takes
 */
router.post("/:id/takes", MedicationController_1.MedicationController.logTake);
router.get("/:id/takes", MedicationController_1.MedicationController.listTakes);
exports.default = router;
//# sourceMappingURL=medicationRoutes.js.map