import { Router } from "express";
import multer from "multer";
import { VoiceController } from "@/modules/voice-notes/infrastructure/controllers/VoiceController";
import { requireAuth } from "@/presentation/middlewares/authMiddleware";
import { requireRole } from "@/presentation/middlewares/requireRole";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();
router.use(requireAuth);

router.post("/upload", requireRole("patient"), upload.single("voice"), VoiceController.upload);
router.get("/", requireRole("patient"), VoiceController.list);
router.delete("/:id", requireRole("patient"), VoiceController.remove);

export default router;