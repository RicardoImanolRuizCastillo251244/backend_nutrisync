import type { Request, Response } from "express";
import { AssignPlanToPatientUseCase } from "@/modules/assignments/application/use-cases/AssignPlanToPatientUseCase";
import { UnassignPlanUseCase } from "@/modules/assignments/application/use-cases/UnassignPlanUseCase";
import { PrismaPatientPlanAssignmentRepository } from "@/modules/assignments/infrastructure/repositories/PrismaPatientPlanAssignmentRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaPatientPlanAssignmentRepository();
const assignUseCase = new AssignPlanToPatientUseCase(repository);
const unassignUseCase = new UnassignPlanUseCase(repository);

export class AssignmentController {
  static async assign(req: Request, res: Response) {
    try {
      const patientId = String(req.params.patientId ?? "");
      const { planId } = req.body;
      const assignment = await assignUseCase.execute({
        patientId,
        planId,
        nutritionistUserId: req.user!.userId,
      });
      return ok(res, assignment, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al asignar plan";
      return fail(res, message, 500);
    }
  }

  static async unassign(req: Request, res: Response) {
    try {
      const patientId = String(req.params.patientId ?? "");
      const { planId } = req.body;
      await unassignUseCase.execute({ patientId, planId });
      return ok(res, { message: "Plan unassigned" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al desasignar plan";
      return fail(res, message, 500);
    }
  }

  static async listByPatient(req: Request, res: Response) {
    try {
      const patientId = String(req.params.patientId ?? "");
      const assignments = await repository.listByPatient(patientId);
      return ok(res, assignments);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al listar asignaciones";
      return fail(res, message, 500);
    }
  }

  static async listByNutritionist(req: Request, res: Response) {
    try {
      const assignments = await repository.listByNutritionist(req.user!.userId);
      return ok(res, assignments);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al listar asignaciones";
      return fail(res, message, 500);
    }
  }
}