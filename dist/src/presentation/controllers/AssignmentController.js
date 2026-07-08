"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentController = void 0;
const AssignPlanToPatientUseCase_1 = require("../../core/use-cases/assignments/AssignPlanToPatientUseCase");
const UnassignPlanUseCase_1 = require("../../core/use-cases/assignments/UnassignPlanUseCase");
const PrismaPatientPlanAssignmentRepository_1 = require("../../infrastructure/repositories/PrismaPatientPlanAssignmentRepository");
const response_1 = require("../../shared/utils/response");
const repository = new PrismaPatientPlanAssignmentRepository_1.PrismaPatientPlanAssignmentRepository();
const assignUseCase = new AssignPlanToPatientUseCase_1.AssignPlanToPatientUseCase(repository);
const unassignUseCase = new UnassignPlanUseCase_1.UnassignPlanUseCase(repository);
class AssignmentController {
    static async assign(req, res) {
        const planId = String(req.params.id ?? "");
        const { patientId } = req.body;
        const assignment = await assignUseCase.execute({
            patientId,
            planId,
            nutritionistUserId: req.user.userId,
        });
        return (0, response_1.ok)(res, assignment, 201);
    }
    static async unassign(req, res) {
        const planId = String(req.params.id ?? "");
        const { patientId } = req.body;
        const assignment = await unassignUseCase.execute({
            patientId,
            planId,
        });
        if (!assignment)
            return (0, response_1.fail)(res, "No active assignment found", 404);
        return (0, response_1.ok)(res, assignment);
    }
    static async getAssignments(req, res) {
        const patientId = String(req.params.patientId ?? "");
        const assignments = await repository.findByPatient(patientId);
        return (0, response_1.ok)(res, assignments);
    }
}
exports.AssignmentController = AssignmentController;
//# sourceMappingURL=AssignmentController.js.map