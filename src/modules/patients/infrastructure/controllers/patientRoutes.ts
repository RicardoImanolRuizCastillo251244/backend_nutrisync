import { Router } from "express";
import { PatientController } from "@/modules/patients/infrastructure/controllers/PatientController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";

const router = Router();

// Rutas que requieren autenticación de nutriólogo
router.use(requireAuth, requireRole("nutritionist"));

// CRUD de pacientes
router.get("/", PatientController.list);
router.get("/pending", PatientController.listPending);
router.post("/", PatientController.create);
router.get("/:id", PatientController.getById);
router.patch("/:id", PatientController.update);
router.delete("/:id", PatientController.remove);

// Aprobación de pacientes
router.post("/:id/approve", PatientController.approve);

// Alias legacy
router.post("/:patientId/link", PatientController.linkToNutritionist);

export default router;