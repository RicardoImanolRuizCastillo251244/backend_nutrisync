import type { EdamamApiClient } from "../../../infrastructure/external-apis/EdamamApiClient";

interface Input {
  caloriesTarget: number;
}

export class GenerateSuggestedDietPlanUseCase {
  constructor(private readonly edamamClient: EdamamApiClient) {}

  async execute(input: Input) {
    const days = await this.edamamClient.searchMealPlan(input.caloriesTarget, 1);

    if (!days.length) {
      return {
        caloriesTarget: input.caloriesTarget,
        generatedAt: new Date().toISOString(),
        meals: [],
      };
    }

    const firstDay = days[0];

    return {
      caloriesTarget: input.caloriesTarget,
      generatedAt: new Date().toISOString(),
      meals: firstDay,
    };
  }
}