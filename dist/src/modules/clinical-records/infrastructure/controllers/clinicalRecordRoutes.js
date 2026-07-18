"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClinicalRecordController_1 = require("@/modules/clinical-records/infrastructure/controllers/ClinicalRecordController");
const authMiddleware_1 = require("@/presentation/middlewares/authMiddleware");
const requireRole_1 = require("@/presentation/middlewares/requireRole");
const validate_1 = require("@/presentation/middlewares/validate");
const ClinicalRecordDto_1 = require("@/modules/clinical-records/infrastructure/dtos/ClinicalRecordDto");
const router = (0, express_1.Router)();
router.post("/metrics", authMiddleware_1.requireAuth, ClinicalRecordController_1.ClinicalRecordController.upsertMetrics);
router.get("/metrics", authMiddleware_1.requireAuth, ClinicalRecordController_1.ClinicalRecordController.getMetrics);
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("nutritionist"));
router.post("/", (0, validate_1.validateBody)(ClinicalRecordDto_1.createClinicalRecordSchema), ClinicalRecordController_1.ClinicalRecordController.create);
router.get("/patient/:patientId", ClinicalRecordController_1.ClinicalRecordController.list);
router.get("/:id", ClinicalRecordController_1.ClinicalRecordController.getById);
router.patch("/:id", (0, validate_1.validateBody)(ClinicalRecordDto_1.updateClinicalRecordSchema), ClinicalRecordController_1.ClinicalRecordController.update);
router.delete("/:id", ClinicalRecordController_1.ClinicalRecordController.remove);
exports.default = router;
//# sourceMappingURL=clinicalRecordRoutes.js.map