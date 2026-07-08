"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMoodUseCase = void 0;
class LogMoodUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const payload = {
            patientUserId: input.patientUserId,
            mood: input.mood,
            ...(input.note ? { note: input.note } : {}),
        };
        return this.repository.createMoodLog(payload);
    }
}
exports.LogMoodUseCase = LogMoodUseCase;
//# sourceMappingURL=LogMoodUseCase.js.map