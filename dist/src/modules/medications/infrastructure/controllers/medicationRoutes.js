"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MedicationController_1 = require("../../../../modules/medications/infrastructure/controllers/MedicationController");
const authMiddleware_1 = require("../../../../presentation/middlewares/authMiddleware");
const requireRole_1 = require("../../../../presentation/middlewares/requireRole");
const validate_1 = require("../../../../presentation/middlewares/validate");
const MedicationDto_1 = require("../../../../modules/medications/infrastructure/dtos/MedicationDto");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("patient"));
router.post("/", (0, validate_1.validateBody)(MedicationDto_1.createMedicationSchema), MedicationController_1.MedicationController.create);
router.get("/", MedicationController_1.MedicationController.list);
router.get("/:id", MedicationController_1.MedicationController.getById);
router.patch("/:id", (0, validate_1.validateBody)(MedicationDto_1.updateMedicationSchema), MedicationController_1.MedicationController.update);
router.delete("/:id", MedicationController_1.MedicationController.remove);
router.post("/:id/take", MedicationController_1.MedicationController.logTake);
router.get("/:id/takes", MedicationController_1.MedicationController.listTakes);
exports.default = router;
//# sourceMappingURL=medicationRoutes.js.map