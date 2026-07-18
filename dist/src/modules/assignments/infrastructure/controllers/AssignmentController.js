"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentController = void 0;
const AssignPlanToPatientUseCase_1 = require("@/modules/assignments/application/use-cases/AssignPlanToPatientUseCase");
const UnassignPlanUseCase_1 = require("@/modules/assignments/application/use-cases/UnassignPlanUseCase");
const PrismaPatientPlanAssignmentRepository_1 = require("@/modules/assignments/infrastructure/repositories/PrismaPatientPlanAssignmentRepository");
const response_1 = require("@/shared/utils/response");
const repository = new PrismaPatientPlanAssignmentRepository_1.PrismaPatientPlanAssignmentRepository();
const assignUseCase = new AssignPlanToPatientUseCase_1.AssignPlanToPatientUseCase(repository);
const unassignUseCase = new UnassignPlanUseCase_1.UnassignPlanUseCase(repository);
class AssignmentController {
    static async assign(req, res) {
        try {
            const planId = String(req.params.id ?? "");
            const { patientId } = req.body;
            const assignment = await assignUseCase.execute({
                patientId,
                planId,
                nutritionistUserId: req.user.userId,
            });
            return (0, response_1.ok)(res, assignment, 201);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async unassign(req, res) {
        try {
            const planId = String(req.params.id ?? "");
            const { patientId } = req.body;
            await unassignUseCase.execute({ patientId, planId });
            return (0, response_1.ok)(res, { message: "Plan unassigned" });
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async getActiveByPlan(req, res) {
        try {
            const planId = String(req.params.id ?? "");
            const assignments = await repository.findActiveByPlan(planId);
            return (0, response_1.ok)(res, assignments);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async listByPatient(req, res) {
        try {
            const patientId = String(req.params.patientId ?? "");
            const assignments = await repository.listByPatient(patientId);
            return (0, response_1.ok)(res, assignments);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async listByNutritionist(req, res) {
        try {
            const assignments = await repository.listByNutritionist(req.user.userId);
            return (0, response_1.ok)(res, assignments);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
}
exports.AssignmentController = AssignmentController;
//# sourceMappingURL=AssignmentController.js.map