"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogHydrationUseCase = void 0;
class LogHydrationUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const payload = {
            patientUserId: input.patientUserId,
            date: new Date(input.date),
            amountMl: input.amountMl,
        };
        return this.repository.createHydrationLog(payload);
    }
}
exports.LogHydrationUseCase = LogHydrationUseCase;
//# sourceMappingURL=LogHydrationUseCase.js.map