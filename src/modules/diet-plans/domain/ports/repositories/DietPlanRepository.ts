import type { DietPlanEntity } from "@/modules/diet-plans/domain/entities/DietPlan";

export interface CreateDietPlanInput {
  nutritionistUserId: string;
  name: string;
  notes?: string;
  days: Array<{
    dayNumber: number;
    meals: Array<{
      name: string;
      note?: string;
      items: Array<{
        name: string;
        portion?: string;
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        edamamRecipeUrl?: string;
        imageUrl?: string;
        healthLabels: string[];
        dietLabels: string[];
      }>;
    }>;
  }>;
}

export interface DietPlanRepository {
  create(input: CreateDietPlanInput): Promise<DietPlanEntity>;
  findById(id: string): Promise<DietPlanEntity | null>;
  listByNutritionist(nutritionistUserId: string): Promise<DietPlanEntity[]>;
  update(id: string, data: Partial<{ name: string; notes: string | null; isActive: boolean }>): Promise<DietPlanEntity | null>;
  softDelete(id: string): Promise<void>;
}