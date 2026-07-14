export interface MetricsInput {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: "male" | "female";
}

export interface CalculatedMetrics {
  bmi: number;
  bmiClassification: string;
  bodyFatPercentage: number;
  visceralFat: number;
  muscleMass: number;
  biologicalAge: number;
  restingMetabolism: number;
  riskLevel: string;
}

export class CalculateClinicalMetrics {
  execute(input: MetricsInput): CalculatedMetrics {
    const bmi = this.calcBmi(input.weightKg, input.heightCm);
    return {
      bmi: Math.round(bmi * 100) / 100,
      bmiClassification: this.classifyBMI(bmi),
      bodyFatPercentage: Math.round(this.calcBodyFat(bmi, input.age, input.gender) * 100) / 100,
      visceralFat: Math.round(this.calcVisceralFat(bmi, input.age, input.gender) * 100) / 100,
      muscleMass: Math.round(this.calcMuscleMass(input.weightKg, input.gender) * 100) / 100,
      biologicalAge: Math.round(this.calcBiologicalAge(input.age, bmi, input.gender) * 100) / 100,
      restingMetabolism: Math.round(this.calcRestingMetabolism(input.weightKg, input.heightCm, input.age, input.gender)),
      riskLevel: this.calcRiskLevel(bmi),
    };
  }

  private calcBmi(weightKg: number, heightCm: number): number {
    const h = heightCm / 100;
    return weightKg / (h * h);
  }

  private classifyBMI(bmi: number): string {
    if (bmi < 18.5) return "Bajo peso";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Sobrepeso";
    if (bmi < 35) return "Obesidad grado I";
    if (bmi < 40) return "Obesidad grado II";
    return "Obesidad grado III";
  }

  private calcBodyFat(bmi: number, age: number, gender: string): number {
    const sexFactor = gender === "male" ? 1 : 0;
    return Math.max(2, Math.min(60, 1.20 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4));
  }

  private calcVisceralFat(bmi: number, age: number, gender: string): number {
    return Math.max(1, Math.min(20, bmi * 0.4 + age * 0.05 - (gender === "male" ? 1 : 3)));
  }

  private calcMuscleMass(weightKg: number, gender: string): number {
    const base = weightKg * 0.4;
    return Math.max(15, base + (gender === "male" ? weightKg * 0.05 : 0));
  }

  private calcBiologicalAge(age: number, bmi: number, gender: string): number {
    let bio = age;
    if (bmi > 30) bio += (bmi - 30) * 0.5;
    if (bmi < 18.5) bio += (18.5 - bmi) * 0.3;
    if (gender === "male" && bmi > 28) bio += 2;
    return Math.round(bio);
  }

  private calcRestingMetabolism(w: number, h: number, a: number, gender: string): number {
    return gender === "male"
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
      : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
  }

  private calcRiskLevel(bmi: number): string {
    if (bmi >= 40) return "Muy alto";
    if (bmi >= 30) return "Alto";
    if (bmi >= 25) return "Moderado";
    if (bmi < 18.5) return "Moderado";
    return "Normal";
  }
}