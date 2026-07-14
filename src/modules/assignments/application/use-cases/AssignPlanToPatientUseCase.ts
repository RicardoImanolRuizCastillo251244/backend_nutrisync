import type { PatientPlanAssignmentRepository } from "@/modules/assignments/domain/ports/repositories/PatientPlanAssignmentRepository";

interface Input {
  patientId: string;
  planId: string;
  nutritionistUserId: string;
}

export class AssignPlanToPatientUseCase {
  constructor(private readonly repository: PatientPlanAssignmentRepository) {}

  async execute(input: Input) {
    // RN-011: Deactivate all other active plans for this patient
    const currentActive = await this.repository.findActiveByPatient(input.patientId);
    if (currentActive) {
      await this.repository.unassign(input.patientId, currentActive.planId);
    }

    return this.repository.assign(input.patientId, input.planId, input.nutritionistUserId);
  }
}