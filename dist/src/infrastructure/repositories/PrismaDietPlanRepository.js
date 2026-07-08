"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDietPlanRepository = void 0;
const prisma_1 = require("../database/prisma");
class PrismaDietPlanRepository {
    async create(input) {
        const plan = await prisma_1.prisma.dietPlan.create({
            data: {
                nutritionistUserId: input.nutritionistUserId,
                name: input.name,
                notes: input.notes ?? null,
                isActive: true,
                days: {
                    create: input.days.map((day) => ({
                        dayNumber: day.dayNumber,
                        meals: {
                            create: day.meals.map((meal) => ({
                                name: meal.name,
                                note: meal.note ?? null,
                                items: {
                                    create: meal.items.map((item) => ({
                                        name: item.name,
                                        portion: item.portion ?? null,
                                        calories: item.calories ?? null,
                                        protein: item.protein ?? null,
                                        carbs: item.carbs ?? null,
                                        fat: item.fat ?? null,
                                        edamamRecipeUrl: item.edamamRecipeUrl ?? null,
                                        imageUrl: item.imageUrl ?? null,
                                        healthLabels: item.healthLabels ?? [],
                                        dietLabels: item.dietLabels ?? [],
                                    })),
                                },
                            })),
                        },
                    })),
                },
            },
            include: {
                days: {
                    include: {
                        meals: {
                            include: { items: true },
                        },
                    },
                },
            },
        });
        return this.mapToEntity(plan);
    }
    async getById(id, nutritionistUserId) {
        const plan = await prisma_1.prisma.dietPlan.findFirst({
            where: { id, nutritionistUserId, deletedAt: null },
            include: {
                days: {
                    include: {
                        meals: {
                            include: { items: true },
                        },
                    },
                    orderBy: { dayNumber: "asc" },
                },
            },
        });
        if (!plan)
            return null;
        return this.mapToEntity(plan);
    }
    async listByNutritionist(nutritionistUserId) {
        const plans = await prisma_1.prisma.dietPlan.findMany({
            where: { nutritionistUserId, deletedAt: null },
            include: {
                days: {
                    include: {
                        meals: {
                            include: { items: true },
                        },
                    },
                    orderBy: { dayNumber: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return plans.map((p) => this.mapToEntity(p));
    }
    async update(id, nutritionistUserId, updates) {
        const existing = await prisma_1.prisma.dietPlan.findFirst({
            where: { id, nutritionistUserId, deletedAt: null },
        });
        if (!existing)
            return null;
        const data = {};
        if (updates.name !== undefined)
            data.name = updates.name;
        if (updates.notes !== undefined)
            data.notes = updates.notes;
        if (updates.isActive !== undefined)
            data.isActive = updates.isActive;
        // For days updates, we delete existing and recreate (simpler for nested structures)
        if (updates.days) {
            await prisma_1.prisma.dietDay.deleteMany({ where: { planId: id } });
            await prisma_1.prisma.dietDay.createMany({
                data: updates.days.map((day) => ({
                    planId: id,
                    dayNumber: day.dayNumber ?? 1,
                })),
            });
            // Re-fetch created days to get their IDs
            const createdDays = await prisma_1.prisma.dietDay.findMany({
                where: { planId: id },
                orderBy: { dayNumber: "asc" },
            });
            for (let i = 0; i < Math.min(updates.days.length, createdDays.length); i++) {
                const dayUpdate = updates.days[i];
                const dayRecord = createdDays[i];
                if (!dayUpdate || !dayRecord)
                    continue;
                if (dayUpdate.meals) {
                    for (const mealUpdate of dayUpdate.meals) {
                        const meal = await prisma_1.prisma.meal.create({
                            data: {
                                dayId: dayRecord.id,
                                name: mealUpdate.name ?? "Meal",
                                note: mealUpdate.note ?? null,
                            },
                        });
                        if (mealUpdate.items) {
                            for (const itemUpdate of mealUpdate.items) {
                                await prisma_1.prisma.mealFoodItem.create({
                                    data: {
                                        mealId: meal.id,
                                        name: itemUpdate.name ?? "Item",
                                        portion: itemUpdate.portion ?? null,
                                        calories: itemUpdate.calories ?? null,
                                        protein: itemUpdate.protein ?? null,
                                        carbs: itemUpdate.carbs ?? null,
                                        fat: itemUpdate.fat ?? null,
                                        edamamRecipeUrl: itemUpdate.edamamRecipeUrl ?? null,
                                        imageUrl: itemUpdate.imageUrl ?? null,
                                        healthLabels: itemUpdate.healthLabels ?? [],
                                        dietLabels: itemUpdate.dietLabels ?? [],
                                    },
                                });
                            }
                        }
                    }
                }
            }
        }
        if (Object.keys(data).length > 0) {
            await prisma_1.prisma.dietPlan.update({
                where: { id },
                data,
            });
        }
        return this.getById(id, nutritionistUserId);
    }
    async softDelete(id, nutritionistUserId) {
        await prisma_1.prisma.dietPlan.updateMany({
            where: { id, nutritionistUserId, deletedAt: null },
            data: { deletedAt: new Date(), isActive: false },
        });
    }
    mapToEntity(raw) {
        const p = raw;
        return {
            id: p.id,
            nutritionistUserId: p.nutritionistUserId,
            name: p.name,
            notes: p.notes,
            isActive: p.isActive,
            deletedAt: p.deletedAt,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            days: p.days.map((day) => ({
                id: day.id,
                planId: day.planId,
                dayNumber: day.dayNumber,
                createdAt: day.createdAt,
                meals: day.meals.map((meal) => ({
                    id: meal.id,
                    dayId: meal.dayId,
                    name: meal.name,
                    note: meal.note,
                    createdAt: meal.createdAt,
                    items: meal.items.map((item) => ({
                        id: item.id,
                        mealId: item.mealId,
                        name: item.name,
                        portion: item.portion,
                        calories: item.calories,
                        protein: item.protein,
                        carbs: item.carbs,
                        fat: item.fat,
                        edamamRecipeUrl: item.edamamRecipeUrl,
                        imageUrl: item.imageUrl,
                        healthLabels: item.healthLabels,
                        dietLabels: item.dietLabels,
                    })),
                })),
            })),
        };
    }
}
exports.PrismaDietPlanRepository = PrismaDietPlanRepository;
//# sourceMappingURL=PrismaDietPlanRepository.js.map