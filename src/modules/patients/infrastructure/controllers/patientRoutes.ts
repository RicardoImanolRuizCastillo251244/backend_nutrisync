import { Router } from "express";
import { PatientController } from "@/modules/patients/infrastructure/controllers/PatientController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";

const router = Router();
router.use(requireAuth, requireRole("nutritionist"));

router.get("/", PatientController.list);
router.get("/:id", PatientController.getById);
router.patch("/:id", PatientController.update);
router.delete("/:id", PatientController.remove);
router.post("/:patientId/link", PatientController.linkToNutritionist);

export default router;