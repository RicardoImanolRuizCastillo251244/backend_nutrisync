"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PatientController_1 = require("@/modules/patients/infrastructure/controllers/PatientController");
const authMiddleware_1 = require("@/presentation/middlewares/authMiddleware");
const requireRole_1 = require("@/presentation/middlewares/requireRole");
const router = (0, express_1.Router)();
// Rutas que requieren autenticación de nutriólogo
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"));
// CRUD de pacientes
router.get("/", PatientController_1.PatientController.list);
router.get("/pending", PatientController_1.PatientController.listPending);
router.post("/", PatientController_1.PatientController.create);
router.get("/:id", PatientController_1.PatientController.getById);
router.patch("/:id", PatientController_1.PatientController.update);
router.delete("/:id", PatientController_1.PatientController.remove);
// Aprobación de pacientes
router.post("/:id/approve", PatientController_1.PatientController.approve);
// Alias legacy
router.post("/:patientId/link", PatientController_1.PatientController.linkToNutritionist);
exports.default = router;
//# sourceMappingURL=patientRoutes.js.map