import type { PatientPlanAssignmentRepository } from "@/modules/assignments/domain/ports/repositories/PatientPlanAssignmentRepository";
import type { PatientPlanAssignmentEntity } from "@/modules/assignments/domain/entities/PatientPlanAssignment";
import { prisma } from "@/shared/infrastructure/database/prisma";

export class PrismaPatientPlanAssignmentRepository implements PatientPlanAssignmentRepository {
  async assign(patientId: string, planId: string, nutritionistUserId: string): Promise<PatientPlanAssignmentEntity> {
    const assignment = await prisma.patientPlanAssignment.create({
      data: { patientId, planId, nutritionistUserId, active: true },
    });
    return assignment as PatientPlanAssignmentEntity;
  }

  async unassign(patientId: string, planId: string): Promise<void> {
    await prisma.patientPlanAssignment.updateMany({
      where: { patientId, planId, active: true },
      data: { active: false, endedAt: new Date() },
    });
  }

  async findActiveByPatient(patientId: string): Promise<PatientPlanAssignmentEntity | null> {
    const assignment = await prisma.patientPlanAssignment.findFirst({
      where: { patientId, active: true },
      orderBy: { assignedAt: "desc" },
    });
    return assignment as PatientPlanAssignmentEntity | null;
  }

  async findActiveByPlan(planId: string): Promise<PatientPlanAssignmentEntity[]> {
    return prisma.patientPlanAssignment.findMany({
      where: { planId, active: true },
      orderBy: { assignedAt: "desc" },
    }) as Promise<PatientPlanAssignmentEntity[]>;
  }

  async listByPatient(patientId: string): Promise<PatientPlanAssignmentEntity[]> {
    const assignments = await prisma.patientPlanAssignment.findMany({
      where: { patientId },
      orderBy: { assignedAt: "desc" },
    });
    return assignments as PatientPlanAssignmentEntity[];
  }

  async listByNutritionist(nutritionistUserId: string): Promise<PatientPlanAssignmentEntity[]> {
    const assignments = await prisma.patientPlanAssignment.findMany({
      where: { nutritionistUserId },
      orderBy: { assignedAt: "desc" },
    });
    return assignments as PatientPlanAssignmentEntity[];
  }
}