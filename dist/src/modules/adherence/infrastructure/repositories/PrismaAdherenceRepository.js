"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAdherenceRepository = void 0;
const prisma_1 = require("../../../../shared/infrastructure/database/prisma");
const cast = (v) => v;
class PrismaAdherenceRepository {
    async createMealLog(input) {
        // Bypass del tipado estricto de Prisma para campos nuevos (note)
        // que existen en BD pero no en el cliente generado en Render
        return cast(prisma_1.prisma.mealLog.create({ data: input }));
    }
    async createHydrationLog(input) {
        return cast(prisma_1.prisma.hydrationLog.create({ data: input }));
    }
    async createMoodLog(input) {
        return cast(prisma_1.prisma.moodLog.create({ data: input }));
    }
    async listMealLogs(patientUserId, date) {
        const where = { patientUserId };
        if (date)
            where.date = { gte: new Date(date.toISOString().slice(0, 10)), lt: new Date(new Date(date.toISOString().slice(0, 10)).getTime() + 86400000) };
        return cast(prisma_1.prisma.mealLog.findMany({ where, orderBy: { createdAt: "desc" }, include: { voiceNotes: true } }));
    }
    async listHydrationLogs(patientUserId, date) {
        const where = { patientUserId };
        if (date)
            where.loggedAt = { gte: new Date(date.toISOString().slice(0, 10)), lt: new Date(new Date(date.toISOString().slice(0, 10)).getTime() + 86400000) };
        return cast(prisma_1.prisma.hydrationLog.findMany({ where, orderBy: { loggedAt: "desc" } }));
    }
    async listMoodLogs(patientUserId, date) {
        const where = { patientUserId };
        if (date)
            where.loggedAt = { gte: new Date(date.toISOString().slice(0, 10)), lt: new Date(new Date(date.toISOString().slice(0, 10)).getTime() + 86400000) };
        return cast(prisma_1.prisma.moodLog.findMany({ where, orderBy: { loggedAt: "desc" } }));
    }
    async getSummary(patientUserId, date) {
        const today = date ? new Date(date.toISOString().slice(0, 10)) : new Date(new Date().toISOString().slice(0, 10));
        const tomorrow = new Date(today.getTime() + 86400000);
        return this.computeSummary(patientUserId, today, tomorrow);
    }
    async getSummaryInRange(patientUserId, from, to) {
        const toDate = to ?? new Date();
        return this.computeSummary(patientUserId, from, toDate);
    }
    async computeSummary(patientUserId, from, to) {
        const mealsWhere = { patientUserId, date: { gte: from, lt: to } };
        const hydrationsWhere = { patientUserId, loggedAt: { gte: from, lt: to } };
        const moodsWhere = { patientUserId, loggedAt: { gte: from, lt: to } };
        const [meals, hydrations, moods] = await Promise.all([
            prisma_1.prisma.mealLog.findMany({ where: mealsWhere }),
            prisma_1.prisma.hydrationLog.findMany({ where: hydrationsWhere }),
            prisma_1.prisma.moodLog.findMany({ where: moodsWhere }),
        ]);
        const mealsCompleted = meals.filter(m => m.consumed).length;
        const hydrationTotalMl = hydrations.reduce((sum, h) => sum + h.amountMl, 0);
        const adherenceRate = meals.length > 0 ? mealsCompleted / meals.length : 0;
        return {
            mealsLogged: meals.length,
            mealsCompleted,
            hydrationTotalMl,
            moodEntries: moods.length,
            adherenceRate: Math.round(adherenceRate * 100) / 100,
        };
    }
    async updateMealLog(id, data) {
        try {
            return cast(prisma_1.prisma.mealLog.update({ where: { id }, data: data }));
        }
        catch {
            return null;
        }
    }
}
exports.PrismaAdherenceRepository = PrismaAdherenceRepository;
//# sourceMappingURL=PrismaAdherenceRepository.js.map