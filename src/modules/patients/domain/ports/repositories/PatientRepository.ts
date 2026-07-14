import type { PatientEntity } from "../../entities/Patient";

export interface CreatePatientInput {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string | null;
  birthDate?: Date | null;
  gender?: "male" | "female" | "other" | null;
}

export interface PatientWithUser {
  id: string;
  userId: string;
  nutritionistUserId: string | null;
  status: string | null;
  phone: string | null;
  birthDate: Date | null;
  gender: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

export interface PatientRepository {
  findById(id: string): Promise<PatientWithUser | null>;
  findByUserId(userId: string): Promise<PatientEntity | null>;
  listByNutritionist(nutritionistUserId: string): Promise<PatientWithUser[]>;
  listPending(): Promise<PatientWithUser[]>;
  createPatientWithUser(input: CreatePatientInput): Promise<PatientEntity>;
  update(id: string, data: Partial<Pick<PatientEntity, "nutritionistUserId" | "status" | "phone" | "birthDate" | "gender">>): Promise<PatientEntity | null>;
  softDelete(id: string): Promise<void>;
  linkToNutritionist(patientId: string, nutritionistUserId: string): Promise<PatientEntity>;
}