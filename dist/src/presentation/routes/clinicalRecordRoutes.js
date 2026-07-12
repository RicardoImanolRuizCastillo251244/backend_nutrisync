"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClinicalRecordController_1 = require("../controllers/ClinicalRecordController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const validate_1 = require("../middlewares/validate");
const clinicalRecordValidators_1 = require("../validators/clinicalRecordValidators");
const router = (0, express_1.Router)();
// Patient endpoints — sin rol de nutriólogo
router.post("/metrics", authMiddleware_1.requireAuth, ClinicalRecordController_1.ClinicalRecordController.upsertMetrics);
router.get("/metrics", authMiddleware_1.requireAuth, ClinicalRecordController_1.ClinicalRecordController.getMetrics);
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"));
router.post("/", (0, validate_1.validateBody)(clinicalRecordValidators_1.createClinicalRecordSchema), ClinicalRecordController_1.ClinicalRecordController.create);
router.get("/patient/:patientId", ClinicalRecordController_1.ClinicalRecordController.list);
router.get("/:id", ClinicalRecordController_1.ClinicalRecordController.getById);
router.patch("/:id", (0, validate_1.validateBody)(clinicalRecordValidators_1.updateClinicalRecordSchema), ClinicalRecordController_1.ClinicalRecordController.update);
router.delete("/:id", ClinicalRecordController_1.ClinicalRecordController.remove);
router.post("/:id/recalculate", ClinicalRecordController_1.ClinicalRecordController.recalculate);
exports.default = router;
//# sourceMappingURL=clinicalRecordRoutes.js.map