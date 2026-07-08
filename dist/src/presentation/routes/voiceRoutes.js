"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const VoiceController_1 = require("../controllers/VoiceController");
const PrismaVoiceNoteRepository_1 = require("../../infrastructure/repositories/PrismaVoiceNoteRepository");
const ListVoiceNotesUseCase_1 = require("../../core/use-cases/voice-notes/ListVoiceNotesUseCase");
const DeleteVoiceNoteUseCase_1 = require("../../core/use-cases/voice-notes/DeleteVoiceNoteUseCase");
const GetVoiceNoteSignedUrlUseCase_1 = require("../../core/use-cases/voice-notes/GetVoiceNoteSignedUrlUseCase");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const response_1 = require("../../shared/utils/response");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ limits: { fileSize: 10 * 1024 * 1024 } });
const voiceNoteRepository = new PrismaVoiceNoteRepository_1.PrismaVoiceNoteRepository();
const listUseCase = new ListVoiceNotesUseCase_1.ListVoiceNotesUseCase(voiceNoteRepository);
const deleteUseCase = new DeleteVoiceNoteUseCase_1.DeleteVoiceNoteUseCase(voiceNoteRepository);
const signedUrlUseCase = new GetVoiceNoteSignedUrlUseCase_1.GetVoiceNoteSignedUrlUseCase(voiceNoteRepository);
router.post("/", authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("patient"), upload.single("file"), VoiceController_1.VoiceController.upload);
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
router.get("/", authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("patient"), async (req, res) => {
    const notes = await listUseCase.execute(req.user.userId);
    return (0, response_1.ok)(res, notes);
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
router.get("/meal-log/:mealLogId", authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("patient"), async (req, res) => {
    const mealLogId = String(req.params.mealLogId ?? "");
    const notes = await voiceNoteRepository.listByMealLog(mealLogId, req.user.userId);
    return (0, response_1.ok)(res, notes);
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
router.get("/:id/signed-url", authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("patient"), async (req, res) => {
    const id = String(req.params.id ?? "");
    const notes = await voiceNoteRepository.listByPatient(req.user.userId);
    const note = notes.find((n) => n.id === id);
    if (!note)
        return (0, response_1.fail)(res, "Voice note not found", 404);
    const url = await signedUrlUseCase.execute({ key: note.storageKey });
    return (0, response_1.ok)(res, { url });
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
router.delete("/:id", authMiddleware_1.requireAuth, (0, requireRole_1.requireRole)("patient"), async (req, res) => {
    const id = String(req.params.id ?? "");
    const deleted = await deleteUseCase.execute({ id, patientUserId: req.user.userId });
    if (!deleted)
        return (0, response_1.fail)(res, "Voice note not found", 404);
    return (0, response_1.ok)(res, { message: "Voice note deleted" });
});
exports.default = router;
//# sourceMappingURL=voiceRoutes.js.map