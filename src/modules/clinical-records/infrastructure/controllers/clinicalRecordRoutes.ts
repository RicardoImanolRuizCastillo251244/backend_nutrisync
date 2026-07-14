import { Router } from "express";
import { ClinicalRecordController } from "@/modules/clinical-records/infrastructure/controllers/ClinicalRecordController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";
import { validateBody } from "@/presentation/middlewares/validate";
import { createClinicalRecordSchema, updateClinicalRecordSchema } from "@/modules/clinical-records/infrastructure/dtos/ClinicalRecordDto";

const router = Router();

router.post("/metrics", requireAuth, ClinicalRecordController.upsertMetrics);
router.get("/metrics", requireAuth, ClinicalRecordController.getMetrics);

router.use(requireAuth, requireRole("nutritionist"));

router.post("/", validateBody(createClinicalRecordSchema), ClinicalRecordController.create);
router.get("/patient/:patientId", ClinicalRecordController.list);
router.get("/:id", ClinicalRecordController.getById);
router.patch("/:id", validateBody(updateClinicalRecordSchema), ClinicalRecordController.update);
router.delete("/:id", ClinicalRecordController.remove);

export default router;