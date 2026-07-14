export interface UserEntity {
  id: string;
  email: string;
  name: string;
  role: "nutritionist" | "patient";
  passwordHash: string;
  patientProfileId?: string | null;
  patientNutritionistId?: string | null;
  createdAt: Date;
}