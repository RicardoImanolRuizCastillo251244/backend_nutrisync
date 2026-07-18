"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanController = void 0;
const CreateDietPlanUseCase_1 = require("@/modules/diet-plans/application/use-cases/CreateDietPlanUseCase");
const PrismaDietPlanRepository_1 = require("@/modules/diet-plans/infrastructure/repositories/PrismaDietPlanRepository");
const PrismaPatientRepository_1 = require("@/modules/patients/infrastructure/repositories/PrismaPatientRepository");
const PrismaPatientPlanAssignmentRepository_1 = require("@/modules/assignments/infrastructure/repositories/PrismaPatientPlanAssignmentRepository");
const PrismaAdherenceRepository_1 = require("@/modules/adherence/infrastructure/repositories/PrismaAdherenceRepository");
const response_1 = require("@/shared/utils/response");
const repository = new PrismaDietPlanRepository_1.PrismaDietPlanRepository();
const createUseCase = new CreateDietPlanUseCase_1.CreateDietPlanUseCase(repository);
const patientRepo = new PrismaPatientRepository_1.PrismaPatientRepository();
const assignmentRepo = new PrismaPatientPlanAssignmentRepository_1.PrismaPatientPlanAssignmentRepository();
const adherenceRepo = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
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
            // Flutter ahora envía el UUID de la meal como mealName (ej: "c4772c72-...")
            const mealLogs = await adherenceRepo.listMealLogs(patient.userId);
            const consumedUuids = new Set();
            for (const log of mealLogs) {
                if (log.consumed && log.mealName) {
                    consumedUuids.add(log.mealName);
                }
            }
            for (const day of plan.days ?? []) {
                for (const meal of day.meals ?? []) {
                    meal.isConsumed = consumedUuids.has(meal.id);
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