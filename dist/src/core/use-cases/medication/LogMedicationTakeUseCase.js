"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMedicationTakeUseCase = void 0;
class LogMedicationTakeUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        return this.repository.logTake(input.medicationId, input.patientUserId);
    }
}
exports.LogMedicationTakeUseCase = LogMedicationTakeUseCase;
//# sourceMappingURL=LogMedicationTakeUseCase.js.map