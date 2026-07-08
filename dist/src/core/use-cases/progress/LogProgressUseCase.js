"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogProgressUseCase = void 0;
class LogProgressUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const payload = {
            patientUserId: input.patientUserId,
            weightKg: input.weightKg,
            ...(input.heightCm ? { heightCm: input.heightCm } : {}),
        };
        return this.repository.create(payload);
    }
}
exports.LogProgressUseCase = LogProgressUseCase;
//# sourceMappingURL=LogProgressUseCase.js.map