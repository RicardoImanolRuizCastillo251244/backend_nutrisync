"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanController = void 0;
const CreateDietPlanUseCase_1 = require("../../../../modules/diet-plans/application/use-cases/CreateDietPlanUseCase");
const PrismaDietPlanRepository_1 = require("../../../../modules/diet-plans/infrastructure/repositories/PrismaDietPlanRepository");
const PrismaPatientRepository_1 = require("../../../../modules/patients/infrastructure/repositories/PrismaPatientRepository");
const PrismaPatientPlanAssignmentRepository_1 = require("../../../../modules/assignments/infrastructure/repositories/PrismaPatientPlanAssignmentRepository");
const PrismaAdherenceRepository_1 = require("../../../../modules/adherence/infrastructure/repositories/PrismaAdherenceRepository");
const response_1 = require("../../../../shared/utils/response");
const repository = new PrismaDietPlanRepository_1.PrismaDietPlanRepository();
const createUseCase = new CreateDietPlanUseCase_1.CreateDietPlanUseCase(repository);
const patientRepo = new PrismaPatientRepository_1.PrismaPatientRepository();
const assignmentRepo = new PrismaPatientPlanAssignmentRepository_1.PrismaPatientPlanAssignmentRepository();
const adherenceRepo = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
/** Replica exactamente el algoritmo _toEntityId de Flutter (meal_plan_repository_impl.dart) */
function hashMealId(value) {
    // Si ya es un número entero, devolverlo directamente
    if (typeof value === "number" && Number.isInteger(value))
        return value;
    if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed))
            return parsed;
    }
    const text = value == null ? "" : String(value).trim();
    if (!text)
        return Date.now();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 31 + text.charCodeAt(i)) & 0x7fffffff;
    }
    return hash === 0 ? Date.now() : hash;
}
class DietPlanController {
    static async create(req, res) {
        try {
            const plan = await createUseCase.execute({ nutritionistUserId: req.user.userId, ...req.body });
            return (0, response_1.ok)(res, plan, 201);
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
    static async list(req, res) {
        try {
            const plans = await repository.listByNutritionist(req.user.userId);
            return (0, response_1.ok)(res, plans);
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
    static async getById(req, res) {
        try {
            const plan = await repository.findById(String(req.params.id ?? ""));
            if (!plan)
                return (0, response_1.fail)(res, "Diet plan not found", 404);
            return (0, response_1.ok)(res, plan);
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
    static async update(req, res) {
        try {
            const updated = await repository.update(String(req.params.id ?? ""), req.body);
            if (!updated)
                return (0, response_1.fail)(res, "Diet plan not found", 404);
            return (0, response_1.ok)(res, updated);
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
    static async remove(req, res) {
        try {
            await repository.softDelete(String(req.params.id ?? ""));
            return (0, response_1.ok)(res, { message: "Diet plan deleted" });
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
    // GET /my-plan — para pacientes autenticados
    static async getMyActivePlan(req, res) {
        try {
            // Buscar el perfil de paciente por userId del token
            const patient = await patientRepo.findByUserId(req.user.userId);
            if (!patient)
                return (0, response_1.fail)(res, "No tienes un perfil de paciente", 403);
            // Buscar la asignación activa para este paciente
            const activeAssignment = await assignmentRepo.findActiveByPatient(patient.id);
            if (!activeAssignment)
                return (0, response_1.fail)(res, "No tienes un plan activo asignado", 404);
            // Obtener el plan completo
            const plan = await repository.findById(activeAssignment.planId);
            if (!plan)
                return (0, response_1.fail)(res, "El plan asignado ya no existe", 404);
            // Enriquecer con estado isConsumed desde los meal logs de adherencia
            const mealLogs = await adherenceRepo.listMealLogs(patient.userId);
            const consumedHashes = new Set();
            for (const log of mealLogs) {
                if (log.consumed && log.mealName.startsWith('meal_')) {
                    const hashStr = log.mealName.replace('meal_', '');
                    const hash = parseInt(hashStr, 10);
                    if (!isNaN(hash))
                        consumedHashes.add(hash);
                }
            }
            // Construir mapa de hash → meal.id real para matching
            for (const day of plan.days ?? []) {
                for (const meal of day.meals ?? []) {
                    const mealHash = hashMealId(meal.id);
                    meal.isConsumed = consumedHashes.has(mealHash);
                }
            }
            return (0, response_1.ok)(res, plan);
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
}
exports.DietPlanController = DietPlanController;
//# sourceMappingURL=DietPlanController.js.map