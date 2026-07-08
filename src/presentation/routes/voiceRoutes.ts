import { Router } from "express";
import multer from "multer";
import { VoiceController } from "../controllers/VoiceController";
import { PrismaVoiceNoteRepository } from "../../infrastructure/repositories/PrismaVoiceNoteRepository";
import { ListVoiceNotesUseCase } from "../../core/use-cases/voice-notes/ListVoiceNotesUseCase";
import { DeleteVoiceNoteUseCase } from "../../core/use-cases/voice-notes/DeleteVoiceNoteUseCase";
import { GetVoiceNoteSignedUrlUseCase } from "../../core/use-cases/voice-notes/GetVoiceNoteSignedUrlUseCase";
import { requireAuth } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { ok, fail } from "../../shared/utils/response";

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
const voiceNoteRepository = new PrismaVoiceNoteRepository();
const listUseCase = new ListVoiceNotesUseCase(voiceNoteRepository);
const deleteUseCase = new DeleteVoiceNoteUseCase(voiceNoteRepository);
const signedUrlUseCase = new GetVoiceNoteSignedUrlUseCase(voiceNoteRepository);

router.post(
  "/",
  requireAuth,
  requireRole("patient"),
  upload.single("file"),
  VoiceController.upload
);

/**
 * @swagger
 * /v1/voice-notes:
 *   get:
 *     summary: List my voice notes (patient only)
 *     tags: [VoiceNotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of voice notes
 */
router.get("/", requireAuth, requireRole("patient"), async (req, res) => {
  const notes = await listUseCase.execute(req.user!.userId);
  return ok(res, notes);
});

/**
 * @swagger
 * /v1/voice-notes/meal-log/{mealLogId}:
 *   get:
 *     summary: List voice notes by meal log (patient only)
 *     tags: [VoiceNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealLogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of voice notes
 */
router.get("/meal-log/:mealLogId", requireAuth, requireRole("patient"), async (req, res) => {
  const mealLogId = String(req.params.mealLogId ?? "");
  const notes = await voiceNoteRepository.listByMealLog(mealLogId, req.user!.userId);
  return ok(res, notes);
});

/**
 * @swagger
 * /v1/voice-notes/{id}/signed-url:
 *   get:
 *     summary: Get signed URL for a voice note (patient only)
 *     tags: [VoiceNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Signed URL
 */
router.get("/:id/signed-url", requireAuth, requireRole("patient"), async (req, res) => {
  const id = String(req.params.id ?? "");
  const notes = await voiceNoteRepository.listByPatient(req.user!.userId);
  const note = notes.find((n) => n.id === id);
  if (!note) return fail(res, "Voice note not found", 404);
  const url = await signedUrlUseCase.execute({ key: note.storageKey });
  return ok(res, { url });
});

/**
 * @swagger
 * /v1/voice-notes/{id}:
 *   delete:
 *     summary: Delete a voice note (patient only)
 *     tags: [VoiceNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete("/:id", requireAuth, requireRole("patient"), async (req, res) => {
  const id = String(req.params.id ?? "");
  const deleted = await deleteUseCase.execute({ id, patientUserId: req.user!.userId });
  if (!deleted) return fail(res, "Voice note not found", 404);
  return ok(res, { message: "Voice note deleted" });
});

export default router;
