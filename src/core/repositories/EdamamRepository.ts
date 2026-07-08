export interface SuggestedMealItem {
  name: string;
  imageUrl?: string;
  portion?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthLabels: string[];
  dietLabels: string[];
  sourceUrl?: string;
}

export interface EdamamRepository {
  searchRecipes(params: {
    mealType: string;
    targetCalories: number;
    tolerance: number;
    randomSeed?: number;
  }): Promise<SuggestedMealItem[]>;

  searchFood(query: string): Promise<SuggestedMealItem[]>;
}
