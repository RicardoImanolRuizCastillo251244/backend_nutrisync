"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListVoiceNotesUseCase = void 0;
class ListVoiceNotesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(patientUserId) {
        return this.repository.listByPatient(patientUserId);
    }
}
exports.ListVoiceNotesUseCase = ListVoiceNotesUseCase;
//# sourceMappingURL=ListVoiceNotesUseCase.js.map