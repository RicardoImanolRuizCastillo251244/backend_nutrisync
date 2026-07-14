import { Router } from "express";
import { VoiceController } from "@/modules/voice-notes/infrastructure/controllers/VoiceController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";

const router = Router();
router.use(requireAuth);

router.get("/", requireRole("patient"), VoiceController.list);
router.delete("/:id", requireRole("patient"), VoiceController.remove);

export default router;