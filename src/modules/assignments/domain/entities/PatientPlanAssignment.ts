export interface PatientPlanAssignmentEntity {
  id: string;
  patientId: string;
  planId: string;
  nutritionistUserId: string;
  active: boolean;
  assignedAt: Date;
  endedAt: Date | null;
}