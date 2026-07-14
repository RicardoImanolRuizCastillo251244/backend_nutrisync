export interface PatientEntity {
  id: string;
  userId: string;
  nutritionistUserId?: string | null;
  status?: string;
  phone?: string | null;
  birthDate?: Date | null;
  gender?: "male" | "female" | "other" | null;
  deletedAt?: Date | null;
  createdAt: Date;
}