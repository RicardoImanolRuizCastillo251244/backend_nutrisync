import { Router } from "express";
import { PatientController } from "../controllers/PatientController";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { validateBody } from "../middlewares/validate";
import { createPatientSchema, updatePatientSchema } from "../validators/patientValidators";

const router = Router();

router.use(requireAuth, requireRole("nutritionist"));

router.post("/", validateBody(createPatientSchema), PatientController.create);
router.get("/", PatientController.list);
router.get("/pending", PatientController.listPending);
router.get("/:id", PatientController.getById);
router.post("/:id/approve", PatientController.approve);
router.patch("/:id", validateBody(updatePatientSchema), PatientController.update);
router.delete("/:id", PatientController.remove);

export default router;
