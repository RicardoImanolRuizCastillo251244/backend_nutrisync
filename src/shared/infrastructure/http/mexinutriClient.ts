import axios from "axios";
import { env } from "@/shared/config/env";

const client = axios.create({
  baseURL: env.MEXINUTRI_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export interface MexiNutriFood {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  baseAmount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  isHealthy: boolean;
  isCommonInMexico: boolean;
}

export interface MexiNutriDish {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: Array<{
    ingredient: MexiNutriFood & { quantity: number };
  }>;
  imageUrl?: string | null;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MexiNutriSearchResult {
  type: "ingredient" | "dish";
  id: string;
  name: string;
  description: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  unit?: string;
  baseAmount?: string;
  tags?: string[];
  imageUrl?: string | null;
  nutrition?: { calories: number; protein: number; carbs: number; fat: number };
}

export interface MexiNutriCalculateResponse {
  items: Array<{
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
    nutrition: { calories: number; protein: number; carbs: number; fat: number };
  }>;
  total: { calories: number; protein: number; carbs: number; fat: number };
}

export interface MexiNutriMealPlanResponse {
  meals: Array<{
    name: string;
    items: Array<{
      name: string;
      portion: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      imageUrl?: string;
    }>;
  }>;
  totalCalories: number;
}

export const mexiNutriClient = {
  search: async (query: string): Promise<MexiNutriSearchResult[]> => {
    const { data } = await client.get<{ success: boolean; results?: MexiNutriSearchResult[] }>("/search", { params: { q: query } });
    return data.results ?? [];
  },

  searchIngredients: async (query: string): Promise<MexiNutriFood[]> => {
    const { data } = await client.get<{ success: boolean; data?: MexiNutriFood[] }>("/ingredients", { params: { q: query } });
    return data.data ?? [];
  },

  searchDishes: async (query: string): Promise<MexiNutriDish[]> => {
    const { data } = await client.get<{ success: boolean; data?: MexiNutriDish[] }>("/dishes", { params: { q: query } });
    return data.data ?? [];
  },

  calculateNutrition: async (items: Array<{ ingredientId: string; quantity: number }>): Promise<MexiNutriCalculateResponse> => {
    const { data } = await client.post<{ success: boolean; data: MexiNutriCalculateResponse }>("/nutrition/calculate", { items });
    return data.data;
  },

  generateMealPlan: async (targetCalories: number, numberOfMeals: number = 3): Promise<MexiNutriMealPlanResponse> => {
    const { data } = await client.post<{ success: boolean; data: MexiNutriMealPlanResponse }>("/meal-plans/generate", {
      targetCalories,
      numberOfMeals,
    });
    return data.data;
  },
};