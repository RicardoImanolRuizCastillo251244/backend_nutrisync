"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClinicalRecordUseCase = void 0;
class CreateClinicalRecordUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const bmi = this.calculateBmi(input.data);
        const bodyFatPercentage = this.calculateBodyFat(input.data, bmi);
        const riskLevel = this.calculateRiskLevel(bmi);
        return this.repository.create({
            patientId: input.patientId,
            date: new Date(input.date),
            data: input.data,
            bmi,
            bodyFatPercentage,
            riskLevel,
        });
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
        // Fórmula Deurenberg: (1.20 * IMC) + (0.23 * edad) - (10.8 * sexo) - 5.4
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
exports.CreateClinicalRecordUseCase = CreateClinicalRecordUseCase;
//# sourceMappingURL=CreateClinicalRecordUseCase.js.map