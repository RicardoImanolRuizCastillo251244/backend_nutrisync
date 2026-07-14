"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMedicationUseCase = void 0;
class CreateMedicationUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const payload = {
            patientUserId: input.patientUserId,
            name: input.name,
            dosage: input.dosage,
            reminderEnabled: input.reminderEnabled ?? false,
            times: input.times,
            days: input.days,
            ...(input.intervalHours ? { intervalHours: input.intervalHours } : {}),
        };
        return this.repository.create(payload);
    }
}
exports.CreateMedicationUseCase = CreateMedicationUseCase;
//# sourceMappingURL=CreateMedicationUseCase.js.map