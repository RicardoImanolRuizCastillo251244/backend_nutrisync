"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMealUseCase = void 0;
class LogMealUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const payload = {
            patientUserId: input.patientUserId,
            mealName: input.mealName,
            date: new Date(input.date),
            consumed: input.consumed ?? false,
            ...(input.planId ? { planId: input.planId } : {}),
            ...(input.consumedAt ? { consumedAt: new Date(input.consumedAt) } : {}),
            ...(input.note != null ? { note: input.note } : {}),
        };
        return this.repository.createMealLog(payload);
    }
}
exports.LogMealUseCase = LogMealUseCase;
//# sourceMappingURL=LogMealUseCase.js.map