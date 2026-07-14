import { Router } from "express";
import { ProgressController } from "@/modules/progress/infrastructure/controllers/ProgressController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";
import { validateBody } from "@/presentation/middlewares/validate";
import { logProgressSchema } from "@/modules/progress/infrastructure/dtos/LogProgressDto";

const router = Router();
router.use(requireAuth);

router.post("/", requireRole("patient"), validateBody(logProgressSchema), ProgressController.log);
router.get("/my-history", requireRole("patient"), ProgressController.getMyHistory);
router.get("/patient/:patientUserId", requireRole("nutritionist"), ProgressController.getPatientHistory);

export default router;