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

// Patient endpoints — sin rol de nutriólogo
router.post("/metrics", requireAuth, ClinicalRecordController.upsertMetrics);
router.get("/metrics", requireAuth, ClinicalRecordController.getMetrics);

router.use(requireAuth, requireRole("nutritionist"));

router.post("/", validateBody(createClinicalRecordSchema), ClinicalRecordController.create);
router.get("/patient/:patientId", ClinicalRecordController.list);
router.get("/:id", ClinicalRecordController.getById);
router.patch("/:id", validateBody(updateClinicalRecordSchema), ClinicalRecordController.update);
router.delete("/:id", ClinicalRecordController.remove);
router.post("/:id/recalculate", ClinicalRecordController.recalculate);

export default router;