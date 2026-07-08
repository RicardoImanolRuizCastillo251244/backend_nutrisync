import { Router } from "express";
import { MedicationController } from "../controllers/MedicationController";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { requirePatientOwnership } from "../middlewares/requirePatientOwnership";
import { validateBody } from "../middlewares/validate";
import { createMedicationSchema, updateMedicationSchema } from "../validators/medicationValidators";

const router = Router();

router.use(requireAuth, requireRole("patient"), requirePatientOwnership);

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
router.post("/", validateBody(createMedicationSchema), MedicationController.create);
router.get("/", MedicationController.list);

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
router.get("/:id", MedicationController.getById);
router.patch("/:id", validateBody(updateMedicationSchema), MedicationController.update);
router.delete("/:id", MedicationController.remove);

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
router.post("/:id/takes", MedicationController.logTake);
router.get("/:id/takes", MedicationController.listTakes);

export default router;