"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnassignPlanUseCase = void 0;
class UnassignPlanUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        return this.repository.unassign(input.patientId, input.planId);
    }
}
exports.UnassignPlanUseCase = UnassignPlanUseCase;
//# sourceMappingURL=UnassignPlanUseCase.js.map