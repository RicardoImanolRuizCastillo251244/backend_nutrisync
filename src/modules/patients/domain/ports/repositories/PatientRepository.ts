import type { PatientEntity } from "@/modules/patients/domain/entities/Patient";

export interface PatientRepository {
  findById(id: string): Promise<PatientEntity | null>;
  findByUserId(userId: string): Promise<PatientEntity | null>;
  listByNutritionist(nutritionistUserId: string): Promise<PatientEntity[]>;
  update(id: string, data: Partial<Pick<PatientEntity, "nutritionistUserId" | "status" | "phone" | "birthDate" | "gender">>): Promise<PatientEntity | null>;
  softDelete(id: string): Promise<void>;
  linkToNutritionist(patientId: string, nutritionistUserId: string): Promise<PatientEntity>;
}