"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceController = void 0;
const uuid_1 = require("uuid");
const ListVoiceNotesUseCase_1 = require("../../../../modules/voice-notes/application/use-cases/ListVoiceNotesUseCase");
const DeleteVoiceNoteUseCase_1 = require("../../../../modules/voice-notes/application/use-cases/DeleteVoiceNoteUseCase");
const PrismaVoiceNoteRepository_1 = require("../../../../modules/voice-notes/infrastructure/repositories/PrismaVoiceNoteRepository");
const SupabaseStorageService_1 = require("../../../../infrastructure/storage/SupabaseStorageService");
const response_1 = require("../../../../shared/utils/response");
const voiceNoteRepository = new PrismaVoiceNoteRepository_1.PrismaVoiceNoteRepository();
const storageService = new SupabaseStorageService_1.SupabaseStorageService();
const listUseCase = new ListVoiceNotesUseCase_1.ListVoiceNotesUseCase(voiceNoteRepository);
const deleteUseCase = new DeleteVoiceNoteUseCase_1.DeleteVoiceNoteUseCase(voiceNoteRepository);
class VoiceController {
    static async list(req, res) {
        try {
            const notes = await listUseCase.execute(req.user.userId);
            return (0, response_1.ok)(res, notes);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al listar notas de voz";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async upload(req, res) {
        try {
            if (!req.file)
                return (0, response_1.fail)(res, "No se envió archivo de voz", 400);
            const mealLogId = req.body.mealLogId || "";
            // Subir a Supabase
            const { key } = await storageService.upload({
                key: `voice-notes/${(0, uuid_1.v4)()}.m4a`,
                body: req.file.buffer,
                contentType: req.file.mimetype || "audio/mp4",
            });
            // Obtener URL firmada (7 días de validez) para acceso público
            const signedUrl = await storageService.getSignedReadUrl(key, 604800);
            // Guardar referencia en BD
            const note = await voiceNoteRepository.create({
                patientUserId: req.user.userId,
                mealLogId,
                storageKey: key,
                publicUrl: signedUrl,
            });
            return (0, response_1.ok)(res, note, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al subir nota de voz";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async remove(req, res) {
        try {
            const id = String(req.params.id ?? "");
            await deleteUseCase.execute({ id, patientUserId: req.user.userId });
            return (0, response_1.ok)(res, { message: "Voice note deleted" });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al eliminar nota de voz";
            return (0, response_1.fail)(res, message, 500);
        }
    }
}
exports.VoiceController = VoiceController;
//# sourceMappingURL=VoiceController.js.map