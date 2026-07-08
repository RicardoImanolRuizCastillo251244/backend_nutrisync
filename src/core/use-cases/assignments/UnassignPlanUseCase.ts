import type { PatientPlanAssignmentRepository } from "../../repositories/PatientPlanAssignmentRepository";

interface Input {
  patientId: string;
  planId: string;
}

export class UnassignPlanUseCase {
  constructor(private readonly repository: PatientPlanAssignmentRepository) {}

  async execute(input: Input) {
    return this.repository.unassign(input.patientId, input.planId);
  }
}