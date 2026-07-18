"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDietPlanRepository = void 0;
const prisma_1 = require("../../../../shared/infrastructure/database/prisma");
const cast = (v) => v;
class PrismaDietPlanRepository {
    async create(input) {
        return cast(prisma_1.prisma.dietPlan.create({
            data: {
                nutritionistUserId: input.nutritionistUserId,
                name: input.name,
                notes: input.notes ?? null,
                days: {
                    create: input.days.map(day => ({
                        dayNumber: day.dayNumber,
                        meals: {
                            create: day.meals.map(meal => ({
                                name: meal.name,
                                note: meal.note ?? null,
                                items: {
                                    create: meal.items.map(item => ({
                                        name: item.name,
                                        portion: item.portion ?? null,
                                        calories: item.calories ?? null,
                                        protein: item.protein ?? null,
                                        carbs: item.carbs ?? null,
                                        fat: item.fat ?? null,
                                        edamamRecipeUrl: item.edamamRecipeUrl ?? null,
                                        imageUrl: item.imageUrl ?? null,
                                        healthLabels: item.healthLabels,
                                        dietLabels: item.dietLabels,
                                    })),
                                },
                            })),
                        },
                    })),
                },
            },
        }));
    }
    async findById(id) {
        const p = await prisma_1.prisma.dietPlan.findUnique({ where: { id }, include: { days: { include: { meals: { include: { items: true } } } } } });
        return p ? cast(p) : null;
    }
    async listByNutritionist(nutritionistUserId) {
        return cast(prisma_1.prisma.dietPlan.findMany({
            where: { nutritionistUserId, deletedAt: null },
            include: { days: { include: { meals: { include: { items: true } } } } },
            orderBy: { createdAt: "desc" },
        }));
    }
    async update(id, data) {
        try {
            const { days, ...planFields } = data;
            // Actualizar campos planos del plan
            if (Object.keys(planFields).length > 0) {
                await prisma_1.prisma.dietPlan.update({ where: { id }, data: planFields });
            }
            // Si se envían days, reemplazar completamente
            if (days) {
                // Eliminar días existentes
                await prisma_1.prisma.dietDay.deleteMany({ where: { planId: id } });
                // Crear nuevos días con meals e items
                for (const day of days) {
                    await prisma_1.prisma.dietDay.create({
                        data: {
                            planId: id,
                            dayNumber: day.dayNumber,
                            meals: {
                                create: day.meals.map(meal => ({
                                    name: meal.name,
                                    note: meal.note ?? null,
                                    items: {
                                        create: meal.items.map(item => ({
                                            name: item.name,
                                            portion: item.portion ?? null,
                                            calories: item.calories ?? null,
                                            protein: item.protein ?? null,
                                            carbs: item.carbs ?? null,
                                            fat: item.fat ?? null,
                                            edamamRecipeUrl: item.edamamRecipeUrl ?? null,
                                            imageUrl: item.imageUrl ?? null,
                                            healthLabels: item.healthLabels,
                                            dietLabels: item.dietLabels,
                                        })),
                                    },
                                })),
                            },
                        },
                    });
                }
            }
            // Retornar el plan actualizado completo
            return this.findById(id);
        }
        catch {
            return null;
        }
    }
    async softDelete(id) {
        await prisma_1.prisma.dietPlan.updateMany({ where: { id }, data: { deletedAt: new Date() } });
    }
}
exports.PrismaDietPlanRepository = PrismaDietPlanRepository;
//# sourceMappingURL=PrismaDietPlanRepository.js.map