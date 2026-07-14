import { Router } from "express";
import { DietPlanController } from "@/modules/diet-plans/infrastructure/controllers/DietPlanController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";

const router = Router();
router.use(requireAuth, requireRole("nutritionist"));

router.post("/", DietPlanController.create);
router.get("/", DietPlanController.list);
router.get("/:id", DietPlanController.getById);
router.patch("/:id", DietPlanController.update);
router.delete("/:id", DietPlanController.remove);

export default router;