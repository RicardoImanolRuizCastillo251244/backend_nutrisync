"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPatientPlanAssignmentRepository = void 0;
const prisma_1 = require("../database/prisma");
class PrismaPatientPlanAssignmentRepository {
    async assign(patientId, planId, nutritionistUserId) {
        const assignment = await prisma_1.prisma.patientPlanAssignment.create({
            data: {
                patientId,
                planId,
                nutritionistUserId,
                active: true,
            },
        });
        return {
            id: assignment.id,
            patientId: assignment.patientId,
            planId: assignment.planId,
            nutritionistUserId: assignment.nutritionistUserId,
            active: assignment.active,
            assignedAt: assignment.assignedAt,
            endedAt: assignment.endedAt,
        };
    }
    async unassign(patientId, planId) {
        const existing = await prisma_1.prisma.patientPlanAssignment.findFirst({
            where: { patientId, planId, active: true },
        });
        if (!existing)
            return null;
        const updated = await prisma_1.prisma.patientPlanAssignment.update({
            where: { id: existing.id },
            data: { active: false, endedAt: new Date() },
        });
        return {
            id: updated.id,
            patientId: updated.patientId,
            planId: updated.planId,
            nutritionistUserId: updated.nutritionistUserId,
            active: updated.active,
            assignedAt: updated.assignedAt,
            endedAt: updated.endedAt,
        };
    }
    async findActiveByPatient(patientId) {
        const assignment = await prisma_1.prisma.patientPlanAssignment.findFirst({
            where: { patientId, active: true },
        });
        if (!assignment)
            return null;
        return {
            id: assignment.id,
            patientId: assignment.patientId,
            planId: assignment.planId,
            nutritionistUserId: assignment.nutritionistUserId,
            active: assignment.active,
            assignedAt: assignment.assignedAt,
            endedAt: assignment.endedAt,
        };
    }
    async findByPatient(patientId, nutritionistUserId) {
        const assignments = await prisma_1.prisma.patientPlanAssignment.findMany({
            where: { patientId, nutritionistUserId },
            orderBy: { assignedAt: "desc" },
        });
        return assignments.map((a) => ({
            id: a.id,
            patientId: a.patientId,
            planId: a.planId,
            nutritionistUserId: a.nutritionistUserId,
            active: a.active,
            assignedAt: a.assignedAt,
            endedAt: a.endedAt,
        }));
    }
    async findActiveByPlan(planId, nutritionistUserId) {
        const assignments = await prisma_1.prisma.patientPlanAssignment.findMany({
            where: { planId, nutritionistUserId, active: true },
            orderBy: { assignedAt: "desc" },
        });
        return assignments.map((a) => ({
            id: a.id,
            patientId: a.patientId,
            planId: a.planId,
            nutritionistUserId: a.nutritionistUserId,
            active: a.active,
            assignedAt: a.assignedAt,
            endedAt: a.endedAt,
        }));
    }
}
exports.PrismaPatientPlanAssignmentRepository = PrismaPatientPlanAssignmentRepository;
//# sourceMappingURL=PrismaPatientPlanAssignmentRepository.js.map