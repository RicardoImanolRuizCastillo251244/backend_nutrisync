"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAdherenceRepository = void 0;
const prisma_1 = require("../database/prisma");
class PrismaAdherenceRepository {
    async createMealLog(input) {
        const log = await prisma_1.prisma.mealLog.create({
            data: {
                patientUserId: input.patientUserId,
                planId: input.planId ?? null,
                mealName: input.mealName,
                date: input.date,
                consumed: input.consumed ?? false,
                consumedAt: input.consumedAt ?? null,
            },
        });
        return log;
    }
    async createHydrationLog(input) {
        const log = await prisma_1.prisma.hydrationLog.create({
            data: {
                patientUserId: input.patientUserId,
                amountMl: input.amountMl,
            },
        });
        return log;
    }
    async createMoodLog(input) {
        const log = await prisma_1.prisma.moodLog.create({
            data: {
                patientUserId: input.patientUserId,
                mood: input.mood,
                note: input.note ?? null,
            },
        });
        return log;
    }
    async getMealLogs(patientUserId, since) {
        const logs = await prisma_1.prisma.mealLog.findMany({
            where: {
                patientUserId,
                date: { gte: since },
            },
            orderBy: { date: "desc" },
        });
        return logs;
    }
    async getHydrationLogs(patientUserId, since) {
        const logs = await prisma_1.prisma.hydrationLog.findMany({
            where: {
                patientUserId,
                loggedAt: { gte: since },
            },
            orderBy: { loggedAt: "desc" },
        });
        return logs;
    }
    async getMoodLogs(patientUserId, since) {
        const logs = await prisma_1.prisma.moodLog.findMany({
            where: {
                patientUserId,
                loggedAt: { gte: since },
            },
            orderBy: { loggedAt: "desc" },
        });
        return logs;
    }
    async getSummary(patientUserId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const [mealLogs, hydrationLogs, moodLogs] = await Promise.all([
            this.getMealLogs(patientUserId, since),
            this.getHydrationLogs(patientUserId, since),
            this.getMoodLogs(patientUserId, since),
        ]);
        const totalMealsLogged = mealLogs.length;
        const totalMealsConsumed = mealLogs.filter((m) => m.consumed).length;
        const mealAdherencePercent = totalMealsLogged > 0 ? Math.round((totalMealsConsumed / totalMealsLogged) * 100) : 0;
        const totalHydration = hydrationLogs.reduce((sum, h) => sum + h.amountMl, 0);
        const avgDailyWaterMl = days > 0 ? Math.round(totalHydration / days) : 0;
        const moodDistribution = {};
        for (const mood of moodLogs) {
            moodDistribution[mood.mood] = (moodDistribution[mood.mood] ?? 0) + 1;
        }
        return {
            mealAdherencePercent,
            totalMealsLogged,
            totalMealsConsumed,
            avgDailyWaterMl,
            totalHydrationLogs: hydrationLogs.length,
            moodDistribution,
            periodDays: days,
        };
    }
    async findPatientByUserId(userId) {
        const patient = await prisma_1.prisma.patient.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!patient)
            return null;
        return { patientId: patient.id };
    }
}
exports.PrismaAdherenceRepository = PrismaAdherenceRepository;
//# sourceMappingURL=PrismaAdherenceRepository.js.map