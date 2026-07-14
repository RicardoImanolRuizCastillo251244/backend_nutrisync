import type { PatientPlanAssignmentRepository } from "@/modules/assignments/domain/ports/repositories/PatientPlanAssignmentRepository";

interface Input {
  patientId: string;
  planId: string;
}

export class UnassignPlanUseCase {
  constructor(private readonly repository: PatientPlanAssignmentRepository) {}

  async execute(input: Input) {
    await this.repository.unassign(input.patientId, input.planId);
  }
}