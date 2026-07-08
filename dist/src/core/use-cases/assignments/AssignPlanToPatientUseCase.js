"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignPlanToPatientUseCase = void 0;
class AssignPlanToPatientUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        // RN-011: Deactivate all other active plans for this patient
        const currentActive = await this.repository.findActiveByPatient(input.patientId);
        if (currentActive) {
            await this.repository.unassign(input.patientId, currentActive.planId);
        }
        return this.repository.assign(input.patientId, input.planId, input.nutritionistUserId);
    }
}
exports.AssignPlanToPatientUseCase = AssignPlanToPatientUseCase;
//# sourceMappingURL=AssignPlanToPatientUseCase.js.map