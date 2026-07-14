"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVoiceNoteUseCase = void 0;
class DeleteVoiceNoteUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        return this.repository.delete(input.id, input.patientUserId);
    }
}
exports.DeleteVoiceNoteUseCase = DeleteVoiceNoteUseCase;
//# sourceMappingURL=DeleteVoiceNoteUseCase.js.map