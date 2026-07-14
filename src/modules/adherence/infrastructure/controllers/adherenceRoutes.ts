import { Router } from "express";
import { AdherenceController } from "@/modules/adherence/infrastructure/controllers/AdherenceController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";
import { validateBody } from "@/presentation/middlewares/validate";
import { logMealSchema, logHydrationSchema, logMoodSchema } from "@/modules/adherence/infrastructure/dtos/AdherenceDto";

const router = Router();
router.use(requireAuth, requireRole("patient"));

router.post("/meals", validateBody(logMealSchema), AdherenceController.logMeal);
router.post("/hydration", validateBody(logHydrationSchema), AdherenceController.logHydration);
router.post("/mood", validateBody(logMoodSchema), AdherenceController.logMood);
router.get("/summary", AdherenceController.getSummary);
router.get("/meals", AdherenceController.listMeals);
router.get("/hydration", AdherenceController.listHydration);
router.get("/mood", AdherenceController.listMood);

export default router;