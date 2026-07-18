"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mexiNutriClient = void 0;
const env_1 = require("../../../shared/config/env");
const BASE_URL = env_1.env.MEXINUTRI_BASE_URL;
async function get(path, params) {
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
    return res.json();
}
async function post(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error(`MexiNutri API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}
exports.mexiNutriClient = {
    search: async (query) => {
        const data = await get("/search", { q: query });
        return data.results ?? [];
    },
    searchIngredients: async (query) => {
        const data = await get("/ingredients", { q: query });
        return data.data ?? [];
    },
    searchDishes: async (query) => {
        const data = await get("/dishes", { q: query });
        return data.data ?? [];
    },
    calculateNutrition: async (items) => {
        const data = await post("/nutrition/calculate", { items });
        return data.data;
    },
    generateMealPlan: async (targetCalories, numberOfMeals = 3) => {
        const data = await post("/meal-plans/generate", {
            targetCalories,
            numberOfMeals,
        });
        if (!data.data?.meals) {
            throw new Error("MexiNutri: respuesta sin meals");
        }
        return data.data;
    },
};
//# sourceMappingURL=mexinutriClient.js.map