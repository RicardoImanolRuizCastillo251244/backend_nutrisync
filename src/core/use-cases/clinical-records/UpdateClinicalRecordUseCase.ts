import type { ClinicalRecordRepository, UpdateClinicalRecordInput } from "../../repositories/ClinicalRecordRepository";

interface Input {
  id: string;
  patientId: string;
  date?: string;
  data?: Record<string, unknown>;
}

export class UpdateClinicalRecordUseCase {
  constructor(private readonly repository: ClinicalRecordRepository) {}

  async execute(input: Input) {
    const existing = await this.repository.getById(input.id, input.patientId);
    if (!existing) return null;

    const mergedData = input.data ? { ...(existing.data as Record<string, unknown>), ...input.data } : (existing.data as Record<string, unknown>);
    const bmi = this.calculateBmi(mergedData);
    const bodyFatPercentage = this.calculateBodyFat(mergedData, bmi);
    const riskLevel = this.calculateRiskLevel(bmi);

    const updates: UpdateClinicalRecordInput = {};
    if (input.date) updates.date = new Date(input.date);
    if (input.data) updates.data = mergedData;
    updates.bmi = bmi;
    updates.bodyFatPercentage = bodyFatPercentage;
    updates.riskLevel = riskLevel;

    return this.repository.update(input.id, input.patientId, updates);
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