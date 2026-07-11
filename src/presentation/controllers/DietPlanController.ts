import type { Request, Response } from "express";
import { GenerateSuggestedDietPlanUseCase } from "../../core/use-cases/diet-plans/GenerateSuggestedDietPlanUseCase";
import { EdamamApiClient } from "../../infrastructure/external-apis/EdamamApiClient";
import { PrismaPatientPlanAssignmentRepository } from "../../infrastructure/repositories/PrismaPatientPlanAssignmentRepository";
import { PrismaDietPlanRepository } from "../../infrastructure/repositories/PrismaDietPlanRepository";
import { ok, fail } from "../../shared/utils/response";

const edamamClient = new EdamamApiClient();
const generateUseCase = new GenerateSuggestedDietPlanUseCase(edamamClient);
const assignmentRepository = new PrismaPatientPlanAssignmentRepository();
const dietPlanRepository = new PrismaDietPlanRepository();

export class DietPlanController {
  static async generateSuggested(req: Request, res: Response) {
    try {
      const result = await generateUseCase.execute({ caloriesTarget: req.body.caloriesTarget });
      return ok(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al generar plan sugerido";
      return fail(res, message, 502);
    }
  }

  static async calculateItem(req: Request, res: Response) {
    const { name, portion, calories, protein, carbs, fat, grams } = req.body;

    // Extraer gramos de referencia de la porción (ej: "100g" → 100, "1 serving" → 100)
    const refMatch = String(portion ?? "").match(/(\d+)\s*g/i);
    const refGrams = refMatch ? Number(refMatch[1]) : 100;

    const factor = Math.max(0, Number(grams)) / refGrams;

    return ok(res, {
      foodName: String(name ?? ""),
      quantity: Number(grams),
      unit: "g" as const,
      portion: String(portion ?? `${grams} g`),
      calories: Math.round(Number(calories ?? 0) * factor),
      protein: Number((Number(protein ?? 0) * factor).toFixed(1)),
      carbs: Number((Number(carbs ?? 0) * factor).toFixed(1)),
      fat: Number((Number(fat ?? 0) * factor).toFixed(1)),
    });
  }

  static async getMyPlan(req: Request, res: Response) {
    const patientId = req.user!.patientId;

    if (!patientId) {
      return fail(res, "No tienes un perfil de paciente asociado", 403);
    }

    try {
      const assignment = await assignmentRepository.findActiveByPatient(patientId);
      if (!assignment) {
        return ok(res, null);
      }

      // Cargar el plan completo usando el nutritionistUserId de la asignación
      const plan = await dietPlanRepository.getById(assignment.planId, assignment.nutritionistUserId);
      if (!plan) {
        return ok(res, null);
      }

      return ok(res, plan);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener plan";
      return fail(res, message, 502);
    }
  }

  static async searchFood(req: Request, res: Response) {
    try {
      const query = String(req.query.query ?? "");
      const foods = await edamamClient.searchFood(query);
      return ok(res, foods);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al buscar alimentos";
      return fail(res, message, 502);
    }
  }
}