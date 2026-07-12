interface MetricsInput {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: "male" | "female";
}

interface CalculatedMetrics {
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
    const heightM = input.heightCm / 100;
    const bmi = Math.round((input.weightKg / (heightM * heightM)) * 100) / 100;

    const bmiClassification = this.classifyBMI(bmi);
    const bodyFatPercentage = this.calculateBodyFat(bmi, input.age, input.gender);
    const visceralFat = this.calculateVisceralFat(bmi, input.age, input.gender);
    const muscleMass = this.calculateMuscleMass(input.weightKg, input.heightCm, input.gender);
    const biologicalAge = this.calculateBiologicalAge(input.age, bmi, input.gender);
    const restingMetabolism = this.calculateRestingMetabolism(input.weightKg, input.heightCm, input.age, input.gender);
    const riskLevel = this.calculateRiskLevel(bmi, bodyFatPercentage);

    return {
      bmi: Math.round(bmi * 100) / 100,
      bmiClassification,
      bodyFatPercentage: Math.round(bodyFatPercentage * 100) / 100,
      visceralFat: Math.round(visceralFat * 100) / 100,
      muscleMass: Math.round(muscleMass * 100) / 100,
      biologicalAge: Math.round(biologicalAge * 100) / 100,
      restingMetabolism: Math.round(restingMetabolism),
      riskLevel,
    };
  }

  private classifyBMI(bmi: number): string {
    if (bmi < 18.5) return "Bajo peso";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Sobrepeso";
    if (bmi < 35) return "Obesidad grado I";
    if (bmi < 40) return "Obesidad grado II";
    return "Obesidad grado III";
  }

  /** Fórmula Deurenberg: %Grasa = (1.20 × BMI) + (0.23 × edad) - (10.8 × sexo) - 5.4 */
  private calculateBodyFat(bmi: number, age: number, gender: string): number {
    const sexFactor = gender === "male" ? 1 : 0;
    const bfp = 1.20 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
    return Math.max(2, Math.min(60, bfp));
  }

  /** Fórmula estimada de grasa visceral basada en BMI, edad y género */
  private calculateVisceralFat(bmi: number, age: number, gender: string): number {
    let visceral = bmi * 0.4 + age * 0.05 - (gender === "male" ? 1 : 3);
    return Math.max(1, Math.min(20, visceral));
  }

  /** Masa muscular estimada: peso - grasa - huesos (~15% peso) - órganos (~25% peso) */
  private calculateMuscleMass(weightKg: number, heightCm: number, gender: string): number {
    const baseMuscle = weightKg * 0.4;
    const genderBonus = gender === "male" ? weightKg * 0.05 : 0;
    return Math.max(15, baseMuscle + genderBonus);
  }

  /** Edad biológica estimada a partir de edad cronológica + ajuste por BMI */
  private calculateBiologicalAge(age: number, bmi: number, gender: string): number {
    let bioAge = age;
    if (bmi > 30) bioAge += (bmi - 30) * 0.5;
    if (bmi < 18.5) bioAge += (18.5 - bmi) * 0.3;
    if (gender === "male" && bmi > 28) bioAge += 2;
    return Math.round(bioAge);
  }

  /** Fórmula Harris-Benedict para metabolismo basal (kcal/día) */
  private calculateRestingMetabolism(weightKg: number, heightCm: number, age: number, gender: string): number {
    if (gender === "male") {
      return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
    }
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;
  }

  private calculateRiskLevel(bmi: number, bodyFatPercentage: number): string {
    if (bmi >= 40 || bodyFatPercentage > 40) return "Muy alto";
    if (bmi >= 30 || bodyFatPercentage > 30) return "Alto";
    if (bmi >= 25 || bodyFatPercentage > 25) return "Moderado";
    if (bmi < 18.5) return "Moderado";
    return "Normal";
  }
}