import { Router } from "express";
import { DietPlanController } from "@/modules/diet-plans/infrastructure/controllers/DietPlanController";
import { AssignmentController } from "@/modules/assignments/infrastructure/controllers/AssignmentController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";

const router = Router();

// Ruta para pacientes: ver su plan activo
router.get("/my-plan", requireAuth, DietPlanController.getMyActivePlan);

// Resto de rutas solo para nutriólogos
router.use(requireAuth, requireRole("nutritionist"));

// CRUD de planes
router.post("/", DietPlanController.create);
router.get("/", DietPlanController.list);
router.get("/:id", DietPlanController.getById);
router.patch("/:id", DietPlanController.update);
router.delete("/:id", DietPlanController.remove);

// Asignación de planes a pacientes (rutas bajo /meal-plans)
router.post("/:id/assign", AssignmentController.assign);
router.post("/:id/unassign", AssignmentController.unassign);
router.get("/:id/assignments/active", AssignmentController.getActiveByPlan);
router.get("/patients/:patientId/assignments", AssignmentController.listByPatient);

export default router;