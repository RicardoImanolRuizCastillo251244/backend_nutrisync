"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdherenceController_1 = require("@/modules/adherence/infrastructure/controllers/AdherenceController");
const authMiddleware_1 = require("@/presentation/middlewares/authMiddleware");
const validate_1 = require("@/presentation/middlewares/validate");
const AdherenceDto_1 = require("@/modules/adherence/infrastructure/dtos/AdherenceDto");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
// POST: patient logs their own data
router.post("/meals", (0, validate_1.validateBody)(AdherenceDto_1.logMealSchema), AdherenceController_1.AdherenceController.logMeal);
router.patch("/meals/:id", AdherenceController_1.AdherenceController.updateMeal);
router.post("/hydration", (0, validate_1.validateBody)(AdherenceDto_1.logHydrationSchema), AdherenceController_1.AdherenceController.logHydration);
router.post("/mood", (0, validate_1.validateBody)(AdherenceDto_1.logMoodSchema), AdherenceController_1.AdherenceController.logMood);
// GET: both patient (own data) and nutritionist (via ?patientId=)
router.get("/summary/:patientUserId", AdherenceController_1.AdherenceController.getSummary);
router.get("/summary", AdherenceController_1.AdherenceController.getSummary);
router.get("/meals", AdherenceController_1.AdherenceController.listMeals);
router.get("/hydration", AdherenceController_1.AdherenceController.listHydration);
router.get("/mood", AdherenceController_1.AdherenceController.listMood);
exports.default = router;
//# sourceMappingURL=adherenceRoutes.js.map