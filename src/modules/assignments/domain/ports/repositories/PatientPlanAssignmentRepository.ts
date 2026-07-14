import type { PatientPlanAssignmentEntity } from "@/modules/assignments/domain/entities/PatientPlanAssignment";

export interface PatientPlanAssignmentRepository {
  assign(patientId: string, planId: string, nutritionistUserId: string): Promise<PatientPlanAssignmentEntity>;
  unassign(patientId: string, planId: string): Promise<void>;
  findActiveByPatient(patientId: string): Promise<PatientPlanAssignmentEntity | null>;
  findActiveByPlan(planId: string): Promise<PatientPlanAssignmentEntity[]>;
  listByPatient(patientId: string): Promise<PatientPlanAssignmentEntity[]>;
  listByNutritionist(nutritionistUserId: string): Promise<PatientPlanAssignmentEntity[]>;
}
