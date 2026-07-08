import type { ClinicalRecordRepository } from "../../repositories/ClinicalRecordRepository";

interface Input {
  patientId: string;
  date: string;
  data: Record<string, unknown>;
}

export class CreateClinicalRecordUseCase {
  constructor(private readonly repository: ClinicalRecordRepository) {}

  async execute(input: Input) {
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

  private calculateBmi(data: Record<string, unknown>): number | null {
    const weightKg = Number(data.weightKg);
    const heightCm = Number(data.heightCm);
    if (!weightKg || !heightCm || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 100) / 100;
  }

  private calculateBodyFat(data: Record<string, unknown>, bmi: number | null): number | null {
    if (bmi === null) return null;
    const age = Number(data.age);
    const gender = String(data.gender ?? "").toLowerCase();
    if (!age || !gender) return null;

    // Fórmula Deurenberg: (1.20 * IMC) + (0.23 * edad) - (10.8 * sexo) - 5.4
    const sexFactor = gender === "male" ? 1 : 0;
    const bfp = 1.20 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
    return Math.round(bfp * 100) / 100;
  }

  private calculateRiskLevel(bmi: number | null): string | null {
    if (bmi === null) return null;
    if (bmi < 18.5) return "underweight";
    if (bmi <= 24.9) return "normal";
    if (bmi <= 29.9) return "overweight";
    return "obese";
  }
}