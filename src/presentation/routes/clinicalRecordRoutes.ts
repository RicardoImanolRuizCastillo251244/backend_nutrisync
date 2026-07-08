import { Router } from "express";
import { ClinicalRecordController } from "../controllers/ClinicalRecordController";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { validateBody } from "../middlewares/validate";
import {
  createClinicalRecordSchema,
  updateClinicalRecordSchema,
} from "../validators/clinicalRecordValidators";

const router = Router();

router.use(requireAuth, requireRole("nutritionist"));

/**
 * @swagger
 * /v1/clinical-records:
 *   post:
 *     summary: Create a clinical record for a patient
 *     tags: [ClinicalRecords]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, date, data]
 *             properties:
 *               patientId:
 *                 type: string
 *               date:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Clinical record created
 *       400:
 *         description: Validation error
 */
router.post("/", validateBody(createClinicalRecordSchema), ClinicalRecordController.create);

/**
 * @swagger
 * /v1/clinical-records/patient/{patientId}:
 *   get:
 *     summary: List clinical records for a patient
 *     tags: [ClinicalRecords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of clinical records
 */
router.get("/patient/:patientId", ClinicalRecordController.list);

/**
 * @swagger
 * /v1/clinical-records/{id}:
 *   get:
 *     summary: Get clinical record by ID
 *     tags: [ClinicalRecords]
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
 *         description: Clinical record
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update clinical record
 *     tags: [ClinicalRecords]
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
 *             properties:
 *               date:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete clinical record
 *     tags: [ClinicalRecords]
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
router.get("/:id", ClinicalRecordController.getById);
router.patch("/:id", validateBody(updateClinicalRecordSchema), ClinicalRecordController.update);
router.delete("/:id", ClinicalRecordController.remove);

/**
 * @swagger
 * /v1/clinical-records/{id}/recalculate:
 *   post:
 *     summary: Recalculate anthropometric metrics for a record
 *     tags: [ClinicalRecords]
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
 *             properties:
 *               weightKg:
 *                 type: number
 *               heightCm:
 *                 type: number
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *     responses:
 *       200:
 *         description: Metrics recalculated
 */
router.post("/:id/recalculate", ClinicalRecordController.recalculate);

export default router;