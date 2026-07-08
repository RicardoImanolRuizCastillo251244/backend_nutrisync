import type { Request, Response } from "express";
import { AssignPlanToPatientUseCase } from "../../core/use-cases/assignments/AssignPlanToPatientUseCase";
import { UnassignPlanUseCase } from "../../core/use-cases/assignments/UnassignPlanUseCase";
import { PrismaPatientPlanAssignmentRepository } from "../../infrastructure/repositories/PrismaPatientPlanAssignmentRepository";
import { ok, fail } from "../../shared/utils/response";

const repository = new PrismaPatientPlanAssignmentRepository();
const assignUseCase = new AssignPlanToPatientUseCase(repository);
const unassignUseCase = new UnassignPlanUseCase(repository);

export class AssignmentController {
  static async assign(req: Request, res: Response) {
    const planId = String(req.params.id ?? "");
    const { patientId } = req.body as { patientId: string };
    const assignment = await assignUseCase.execute({
      patientId,
      planId,
      nutritionistUserId: req.user!.userId,
    });
    return ok(res, assignment, 201);
  }

  static async unassign(req: Request, res: Response) {
    const planId = String(req.params.id ?? "");
    const { patientId } = req.body as { patientId: string };
    const assignment = await unassignUseCase.execute({
      patientId,
      planId,
    });
    if (!assignment) return fail(res, "No active assignment found", 404);
    return ok(res, assignment);
  }

  static async getAssignments(req: Request, res: Response) {
    const patientId = String(req.params.patientId ?? "");
    const assignments = await repository.findByPatient(patientId);
    return ok(res, assignments);
  }
}