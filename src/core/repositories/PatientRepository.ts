import type { PatientEntity } from "../domain/entities/Patient";

export interface CreatePatientInput {
  nutritionistUserId?: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  birthDate?: Date;
  gender?: "male" | "female" | "other";
}

export interface PatientWithUser extends PatientEntity {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface PatientRepository {
  create(input: CreatePatientInput): Promise<PatientWithUser>;
  listByNutritionist(nutritionistUserId: string): Promise<PatientWithUser[]>;
  listPending(): Promise<PatientWithUser[]>;
  getById(id: string, nutritionistUserId: string): Promise<PatientWithUser | null>;
  approve(id: string, nutritionistUserId: string): Promise<PatientWithUser | null>;
  update(
    id: string,
    nutritionistUserId: string,
    updates: Partial<Pick<CreatePatientInput, "name" | "phone" | "birthDate" | "gender">>
  ): Promise<PatientWithUser | null>;
  hardDelete(id: string, nutritionistUserId: string): Promise<boolean>;
}
