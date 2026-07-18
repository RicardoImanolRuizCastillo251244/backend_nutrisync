"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mexiNutriClient = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("@/shared/config/env");
const client = axios_1.default.create({
    baseURL: env_1.env.MEXINUTRI_BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});
exports.mexiNutriClient = {
    search: async (query) => {
        const { data } = await client.get("/search", { params: { q: query } });
        return data.results ?? [];
    },
    searchIngredients: async (query) => {
        const { data } = await client.get("/ingredients", { params: { q: query } });
        return data.data ?? [];
    },
    searchDishes: async (query) => {
        const { data } = await client.get("/dishes", { params: { q: query } });
        return data.data ?? [];
    },
    calculateNutrition: async (items) => {
        const { data } = await client.post("/nutrition/calculate", { items });
        return data.data;
    },
    generateMealPlan: async (targetCalories, numberOfMeals = 3) => {
        const { data } = await client.post("/meal-plans/generate", {
            targetCalories,
            numberOfMeals,
        });
        return data.data;
    },
};
//# sourceMappingURL=mexinutriClient.js.map