"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPatientPlanAssignmentRepository = void 0;
const prisma_1 = require("@/shared/infrastructure/database/prisma");
class PrismaPatientPlanAssignmentRepository {
    async assign(patientId, planId, nutritionistUserId) {
        const assignment = await prisma_1.prisma.patientPlanAssignment.create({
            data: { patientId, planId, nutritionistUserId, active: true },
        });
        return assignment;
    }
    async unassign(patientId, planId) {
        await prisma_1.prisma.patientPlanAssignment.updateMany({
            where: { patientId, planId, active: true },
            data: { active: false, endedAt: new Date() },
        });
    }
    async findActiveByPatient(patientId) {
        const assignment = await prisma_1.prisma.patientPlanAssignment.findFirst({
            where: { patientId, active: true },
            orderBy: { assignedAt: "desc" },
        });
        return assignment;
    }
    async findActiveByPlan(planId) {
        return prisma_1.prisma.patientPlanAssignment.findMany({
            where: { planId, active: true },
            orderBy: { assignedAt: "desc" },
        });
    }
    async listByPatient(patientId) {
        const assignments = await prisma_1.prisma.patientPlanAssignment.findMany({
            where: { patientId },
            orderBy: { assignedAt: "desc" },
        });
        return assignments;
    }
    async listByNutritionist(nutritionistUserId) {
        const assignments = await prisma_1.prisma.patientPlanAssignment.findMany({
            where: { nutritionistUserId },
            orderBy: { assignedAt: "desc" },
        });
        return assignments;
    }
}
exports.PrismaPatientPlanAssignmentRepository = PrismaPatientPlanAssignmentRepository;
//# sourceMappingURL=PrismaPatientPlanAssignmentRepository.js.map