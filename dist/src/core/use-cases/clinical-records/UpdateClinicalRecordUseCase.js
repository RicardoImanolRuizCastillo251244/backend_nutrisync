"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClinicalRecordUseCase = void 0;
class UpdateClinicalRecordUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const { id, patientId, ...updates } = input;
        return this.repository.update(id, patientId, updates);
    }
}
exports.UpdateClinicalRecordUseCase = UpdateClinicalRecordUseCase;
//# sourceMappingURL=UpdateClinicalRecordUseCase.js.map