import type { PatientPlanAssignmentEntity } from "../domain/entities/DietPlan";

export interface PatientPlanAssignmentRepository {
  assign(patientId: string, planId: string, nutritionistUserId: string): Promise<PatientPlanAssignmentEntity>;
  unassign(patientId: string, planId: string): Promise<PatientPlanAssignmentEntity | null>;
  findActiveByPatient(patientId: string): Promise<PatientPlanAssignmentEntity | null>;
  findByPatient(patientId: string): Promise<PatientPlanAssignmentEntity[]>;
}