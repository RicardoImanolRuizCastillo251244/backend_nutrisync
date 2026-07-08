export interface DietDayMealFoodItemEntity {
  id: string;
  mealId: string;
  name: string;
  portion: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  edamamRecipeUrl: string | null;
  imageUrl: string | null;
  healthLabels: string[];
  dietLabels: string[];
}

export interface DietDayMealEntity {
  id: string;
  dayId: string;
  name: string;
  note: string | null;
  createdAt: Date;
  items: DietDayMealFoodItemEntity[];
}

export interface DietDayEntity {
  id: string;
  planId: string;
  dayNumber: number;
  createdAt: Date;
  meals: DietDayMealEntity[];
}

export interface DietPlanEntity {
  id: string;
  nutritionistUserId: string;
  name: string;
  notes: string | null;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  days: DietDayEntity[];
}

export interface PatientPlanAssignmentEntity {
  id: string;
  patientId: string;
  planId: string;
  nutritionistUserId: string;
  active: boolean;
  assignedAt: Date;
  endedAt: Date | null;
}