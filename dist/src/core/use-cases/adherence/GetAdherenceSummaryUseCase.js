"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdherenceSummaryUseCase = void 0;
class GetAdherenceSummaryUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const days = input.days ?? 30;
        return this.repository.getSummary(input.patientUserId, days);
    }
}
exports.GetAdherenceSummaryUseCase = GetAdherenceSummaryUseCase;
//# sourceMappingURL=GetAdherenceSummaryUseCase.js.map