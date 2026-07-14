import type { DietPlanRepository, CreateDietPlanInput, UpdateDietPlanInput } from "@/modules/diet-plans/domain/ports/repositories/DietPlanRepository";
import type { DietPlanEntity } from "@/modules/diet-plans/domain/entities/DietPlan";
import { prisma } from "@/shared/infrastructure/database/prisma";

const cast = <T>(v: unknown): T => v as unknown as T;

export class PrismaDietPlanRepository implements DietPlanRepository {
  async create(input: CreateDietPlanInput): Promise<DietPlanEntity> {
    return cast<DietPlanEntity>(prisma.dietPlan.create({
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

  async findById(id: string): Promise<DietPlanEntity | null> {
    const p = await prisma.dietPlan.findUnique({ where: { id }, include: { days: { include: { meals: { include: { items: true } } } } } });
    return p ? cast<DietPlanEntity>(p) : null;
  }

  async listByNutritionist(nutritionistUserId: string): Promise<DietPlanEntity[]> {
    return cast<DietPlanEntity[]>(prisma.dietPlan.findMany({
      where: { nutritionistUserId, deletedAt: null },
      include: { days: { include: { meals: { include: { items: true } } } } },
      orderBy: { createdAt: "desc" },
    }));
  }

  async update(id: string, data: UpdateDietPlanInput): Promise<DietPlanEntity | null> {
    try {
      const { days, ...planFields } = data;

      // Actualizar campos planos del plan
      if (Object.keys(planFields).length > 0) {
        await prisma.dietPlan.update({ where: { id }, data: planFields });
      }

      // Si se envían days, reemplazar completamente
      if (days) {
        // Eliminar días existentes
        await prisma.dietDay.deleteMany({ where: { planId: id } });

        // Crear nuevos días con meals e items
        for (const day of days) {
          await prisma.dietDay.create({
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
    } catch {
      return null;
    }
  }

  async softDelete(id: string): Promise<void> {
    await prisma.dietPlan.updateMany({ where: { id }, data: { deletedAt: new Date() } });
  }
}