import { Router } from "express";
import { DashboardController } from "@/modules/dashboard/infrastructure/controllers/DashboardController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";

const router = Router();
router.use(requireAuth, requireRole("nutritionist"));

router.get("/nutritionist", DashboardController.getNutritionistDashboard);

export default router;