"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DietPlanController_1 = require("../../../../modules/diet-plans/infrastructure/controllers/DietPlanController");
const AssignmentController_1 = require("../../../../modules/assignments/infrastructure/controllers/AssignmentController");
const authMiddleware_1 = require("../../../../presentation/middlewares/authMiddleware");
const requireRole_1 = require("../../../../presentation/middlewares/requireRole");
const router = (0, express_1.Router)();
// Ruta para pacientes: ver su plan activo
router.get("/my-plan", authMiddleware_1.requireAuth, DietPlanController_1.DietPlanController.getMyActivePlan);
// Resto de rutas solo para nutriólogos
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"));
// CRUD de planes
router.post("/", DietPlanController_1.DietPlanController.create);
router.get("/", DietPlanController_1.DietPlanController.list);
router.get("/:id", DietPlanController_1.DietPlanController.getById);
router.patch("/:id", DietPlanController_1.DietPlanController.update);
router.delete("/:id", DietPlanController_1.DietPlanController.remove);
// Asignación de planes a pacientes (rutas bajo /meal-plans)
router.post("/:id/assign", AssignmentController_1.AssignmentController.assign);
router.post("/:id/unassign", AssignmentController_1.AssignmentController.unassign);
router.get("/:id/assignments/active", AssignmentController_1.AssignmentController.getActiveByPlan);
router.get("/patients/:patientId/assignments", AssignmentController_1.AssignmentController.listByPatient);
exports.default = router;
//# sourceMappingURL=dietPlanRoutes.js.map