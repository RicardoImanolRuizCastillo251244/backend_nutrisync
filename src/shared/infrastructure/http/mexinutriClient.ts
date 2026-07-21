import { env } from "@/shared/config/env";

const BASE_URL = env.MEXINUTRI_BASE_URL;

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const searchParams = params
    ? "?" + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")
    : "";
  const url = `${BASE_URL}${path}${searchParams}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`MexiNutri API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`MexiNutri API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

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
  targetCalories?: number;
  meals: Array<{
    type?: string;
    name: string;
    dishId?: number;
    imageUrl?: string | null;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    ingredients: Array<{
      ingredientId?: number;
      name: string;
      quantity: number;
      unit: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    }>;
  }>;
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const mexiNutriClient = {
  search: async (query: string): Promise<MexiNutriSearchResult[]> => {
    const data = await get<{ success: boolean; results?: MexiNutriSearchResult[] }>("/search", { q: query });
    return data.results ?? [];
  },

  searchIngredients: async (query: string): Promise<MexiNutriFood[]> => {
    const data = await get<{ success: boolean; data?: MexiNutriFood[] }>("/ingredients", { q: query });
    return data.data ?? [];
  },

  searchDishes: async (query: string): Promise<MexiNutriDish[]> => {
    const data = await get<{ success: boolean; data?: MexiNutriDish[] }>("/dishes", { q: query });
    return data.data ?? [];
  },

  calculateNutrition: async (items: Array<{ ingredientId: string; quantity: number }>): Promise<MexiNutriCalculateResponse> => {
    const data = await post<{ success: boolean; data: MexiNutriCalculateResponse }>("/nutrition/calculate", { items });
    return data.data;
  },

  generateMealPlan: async (targetCalories: number, numberOfMeals: number = 3): Promise<MexiNutriMealPlanResponse> => {
    const data = await post<{ success: boolean; data: MexiNutriMealPlanResponse }>("/meal-plans/generate", {
      targetCalories,
      numberOfMeals,
    });
    if (!data.data?.meals) {
      throw new Error("MexiNutri: respuesta sin meals");
    }
    return data.data;
  },
};