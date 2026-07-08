"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClinicalRecordUseCase = void 0;
class UpdateClinicalRecordUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const existing = await this.repository.getById(input.id, input.patientId);
        if (!existing)
            return null;
        const mergedData = input.data ? { ...existing.data, ...input.data } : existing.data;
        const bmi = this.calculateBmi(mergedData);
        const bodyFatPercentage = this.calculateBodyFat(mergedData, bmi);
        const riskLevel = this.calculateRiskLevel(bmi);
        const updates = {};
        if (input.date)
            updates.date = new Date(input.date);
        if (input.data)
            updates.data = mergedData;
        updates.bmi = bmi;
        updates.bodyFatPercentage = bodyFatPercentage;
        updates.riskLevel = riskLevel;
        return this.repository.update(input.id, input.patientId, updates);
    }
    calculateBmi(data) {
        const weightKg = Number(data.weightKg);
        const heightCm = Number(data.heightCm);
        if (!weightKg || !heightCm || heightCm <= 0)
            return null;
        const heightM = heightCm / 100;
        return Math.round((weightKg / (heightM * heightM)) * 100) / 100;
    }
    calculateBodyFat(data, bmi) {
        if (bmi === null)
            return null;
        const age = Number(data.age);
        const gender = String(data.gender ?? "").toLowerCase();
        if (!age || !gender)
            return null;
        const sexFactor = gender === "male" ? 1 : 0;
        const bfp = 1.20 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
        return Math.round(bfp * 100) / 100;
    }
    calculateRiskLevel(bmi) {
        if (bmi === null)
            return null;
        if (bmi < 18.5)
            return "underweight";
        if (bmi <= 24.9)
            return "normal";
        if (bmi <= 29.9)
            return "overweight";
        return "obese";
    }
}
exports.UpdateClinicalRecordUseCase = UpdateClinicalRecordUseCase;
//# sourceMappingURL=UpdateClinicalRecordUseCase.js.map