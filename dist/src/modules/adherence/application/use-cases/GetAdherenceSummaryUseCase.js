"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdherenceSummaryUseCase = void 0;
class GetAdherenceSummaryUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(patientUserId, date) {
        return this.repository.getSummary(patientUserId, date ? new Date(date) : undefined);
    }
}
exports.GetAdherenceSummaryUseCase = GetAdherenceSummaryUseCase;
//# sourceMappingURL=GetAdherenceSummaryUseCase.js.map