import { Router } from "express";
import { AdherenceController } from "@/modules/adherence/infrastructure/controllers/AdherenceController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { validateBody } from "@/presentation/middlewares/validate";
import { logMealSchema, logHydrationSchema, logMoodSchema } from "@/modules/adherence/infrastructure/dtos/AdherenceDto";

const router = Router();
router.use(requireAuth);

// POST: patient logs their own data
router.post("/meals", validateBody(logMealSchema), AdherenceController.logMeal);
router.patch("/meals/:id", AdherenceController.updateMeal);
router.post("/hydration", validateBody(logHydrationSchema), AdherenceController.logHydration);
router.post("/mood", validateBody(logMoodSchema), AdherenceController.logMood);

// GET: both patient (own data) and nutritionist (via ?patientId=)
router.get("/summary/:patientUserId", AdherenceController.getSummary);
router.get("/summary", AdherenceController.getSummary);
router.get("/meals", AdherenceController.listMeals);
router.get("/hydration", AdherenceController.listHydration);
router.get("/mood", AdherenceController.listMood);

export default router;