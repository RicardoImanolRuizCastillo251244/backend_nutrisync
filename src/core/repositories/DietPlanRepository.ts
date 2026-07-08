import type { DietPlanEntity } from "../domain/entities/DietPlan";

export interface CreateDietPlanDayMealItemInput {
  name: string;
  portion?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  edamamRecipeUrl?: string;
  imageUrl?: string;
  healthLabels?: string[];
  dietLabels?: string[];
}

export interface CreateDietPlanDayMealInput {
  name: string;
  note?: string;
  items: CreateDietPlanDayMealItemInput[];
}

export interface CreateDietPlanDayInput {
  dayNumber: number;
  meals: CreateDietPlanDayMealInput[];
}

export interface CreateDietPlanInput {
  nutritionistUserId: string;
  name: string;
  notes?: string;
  days: CreateDietPlanDayInput[];
}

export interface UpdateDietPlanDayMealItemInput {
  id?: string;
  name?: string;
  portion?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  edamamRecipeUrl?: string;
  imageUrl?: string;
  healthLabels?: string[];
  dietLabels?: string[];
}

export interface UpdateDietPlanDayMealInput {
  id?: string;
  name?: string;
  note?: string;
  items?: UpdateDietPlanDayMealItemInput[];
}

export interface UpdateDietPlanDayInput {
  id?: string;
  dayNumber?: number;
  meals?: UpdateDietPlanDayMealInput[];
}

export interface UpdateDietPlanInput {
  name?: string;
  notes?: string;
  isActive?: boolean;
  days?: UpdateDietPlanDayInput[];
}

export interface DietPlanRepository {
  create(input: CreateDietPlanInput): Promise<DietPlanEntity>;
  getById(id: string, nutritionistUserId: string): Promise<DietPlanEntity | null>;
  listByNutritionist(nutritionistUserId: string): Promise<DietPlanEntity[]>;
  update(id: string, nutritionistUserId: string, updates: UpdateDietPlanInput): Promise<DietPlanEntity | null>;
  softDelete(id: string, nutritionistUserId: string): Promise<void>;
}