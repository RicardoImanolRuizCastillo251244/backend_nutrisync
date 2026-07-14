import { Router } from "express";
import { MedicationController } from "@/modules/medications/infrastructure/controllers/MedicationController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";
import { validateBody } from "@/presentation/middlewares/validate";
import { createMedicationSchema, updateMedicationSchema } from "@/modules/medications/infrastructure/dtos/MedicationDto";

const router = Router();
router.use(requireAuth, requireRole("patient"));

router.post("/", validateBody(createMedicationSchema), MedicationController.create);
router.get("/", MedicationController.list);
router.get("/:id", MedicationController.getById);
router.patch("/:id", validateBody(updateMedicationSchema), MedicationController.update);
router.delete("/:id", MedicationController.remove);
router.post("/:id/take", MedicationController.logTake);
router.get("/:id/takes", MedicationController.listTakes);

export default router;