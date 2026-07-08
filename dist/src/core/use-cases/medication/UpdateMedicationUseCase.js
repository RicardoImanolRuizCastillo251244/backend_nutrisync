"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMedicationUseCase = void 0;
class UpdateMedicationUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const existing = await this.repository.getById(input.id, input.patientUserId);
        if (!existing)
            return null;
        const updates = {};
        if (input.name !== undefined)
            updates.name = input.name;
        if (input.dosage !== undefined)
            updates.dosage = input.dosage;
        if (input.reminderEnabled !== undefined)
            updates.reminderEnabled = input.reminderEnabled;
        if (input.times !== undefined)
            updates.times = input.times;
        if (input.days !== undefined)
            updates.days = input.days;
        if (input.intervalHours !== undefined)
            updates.intervalHours = input.intervalHours;
        return this.repository.update(input.id, input.patientUserId, updates);
    }
}
exports.UpdateMedicationUseCase = UpdateMedicationUseCase;
//# sourceMappingURL=UpdateMedicationUseCase.js.map