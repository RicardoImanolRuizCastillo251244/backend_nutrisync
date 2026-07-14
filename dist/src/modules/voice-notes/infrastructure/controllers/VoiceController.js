"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceController = void 0;
const ListVoiceNotesUseCase_1 = require("../../../../modules/voice-notes/application/use-cases/ListVoiceNotesUseCase");
const DeleteVoiceNoteUseCase_1 = require("../../../../modules/voice-notes/application/use-cases/DeleteVoiceNoteUseCase");
const PrismaVoiceNoteRepository_1 = require("../../../../modules/voice-notes/infrastructure/repositories/PrismaVoiceNoteRepository");
const response_1 = require("../../../../shared/utils/response");
const voiceNoteRepository = new PrismaVoiceNoteRepository_1.PrismaVoiceNoteRepository();
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