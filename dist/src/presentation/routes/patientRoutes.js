"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PatientController_1 = require("../controllers/PatientController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const validate_1 = require("../middlewares/validate");
const patientValidators_1 = require("../validators/patientValidators");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"));
router.post("/", (0, validate_1.validateBody)(patientValidators_1.createPatientSchema), PatientController_1.PatientController.create);
router.get("/", PatientController_1.PatientController.list);
router.get("/pending", PatientController_1.PatientController.listPending);
router.get("/:id", PatientController_1.PatientController.getById);
router.post("/:id/approve", PatientController_1.PatientController.approve);
router.patch("/:id", (0, validate_1.validateBody)(patientValidators_1.updatePatientSchema), PatientController_1.PatientController.update);
router.delete("/:id", PatientController_1.PatientController.remove);
exports.default = router;
//# sourceMappingURL=patientRoutes.js.map