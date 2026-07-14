import type { Request, Response } from "express";
import { CreateDietPlanUseCase } from "@/modules/diet-plans/application/use-cases/CreateDietPlanUseCase";
import { PrismaDietPlanRepository } from "@/modules/diet-plans/infrastructure/repositories/PrismaDietPlanRepository";
import { PrismaPatientRepository } from "@/modules/patients/infrastructure/repositories/PrismaPatientRepository";
import { PrismaPatientPlanAssignmentRepository } from "@/modules/assignments/infrastructure/repositories/PrismaPatientPlanAssignmentRepository";
import { PrismaAdherenceRepository } from "@/modules/adherence/infrastructure/repositories/PrismaAdherenceRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaDietPlanRepository();
const createUseCase = new CreateDietPlanUseCase(repository);
const patientRepo = new PrismaPatientRepository();
const assignmentRepo = new PrismaPatientPlanAssignmentRepository();
const adherenceRepo = new PrismaAdherenceRepository();

export class DietPlanController {
  static async create(req: Request, res: Response) {
    try {
      const plan = await createUseCase.execute({ nutritionistUserId: req.user!.userId, ...req.body });
      return ok(res, plan, 201);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async list(req: Request, res: Response) {
    try {
      const plans = await repository.listByNutritionist(req.user!.userId);
      return ok(res, plans);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async getById(req: Request, res: Response) {
    try {
      const plan = await repository.findById(String(req.params.id ?? ""));
      if (!plan) return fail(res, "Diet plan not found", 404);
      return ok(res, plan);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await repository.update(String(req.params.id ?? ""), req.body);
      if (!updated) return fail(res, "Diet plan not found", 404);
      return ok(res, updated);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async remove(req: Request, res: Response) {
    try {
      await repository.softDelete(String(req.params.id ?? ""));
      return ok(res, { message: "Diet plan deleted" });
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  // GET /my-plan — para pacientes autenticados
  static async getMyActivePlan(req: Request, res: Response) {
    try {
      // Buscar el perfil de paciente por userId del token
      const patient = await patientRepo.findByUserId(req.user!.userId);
      if (!patient) return fail(res, "No tienes un perfil de paciente", 403);

      // Buscar la asignación activa para este paciente
      const activeAssignment = await assignmentRepo.findActiveByPatient(patient.id);
      if (!activeAssignment) return fail(res, "No tienes un plan activo asignado", 404);

      // Obtener el plan completo
      const plan = await repository.findById(activeAssignment.planId);
      if (!plan) return fail(res, "El plan asignado ya no existe", 404);

      // Enriquecer con estado isConsumed desde los meal logs de adherencia
      const mealLogs = await adherenceRepo.listMealLogs(patient.userId);
      const consumedMealIds = new Set<string>();
      for (const log of mealLogs) {
        if (log.consumed && log.mealName.startsWith('meal_')) {
          consumedMealIds.add(log.mealName.replace('meal_', ''));
        }
      }

      for (const day of (plan as any).days ?? []) {
        for (const meal of day.meals ?? []) {
          meal.isConsumed = consumedMealIds.has(meal.id);
        }
      }

      return ok(res, plan);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }
}