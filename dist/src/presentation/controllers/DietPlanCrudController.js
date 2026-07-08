"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanCrudController = void 0;
const CreateDietPlanUseCase_1 = require("../../core/use-cases/diet-plans/CreateDietPlanUseCase");
const UpdateDietPlanUseCase_1 = require("../../core/use-cases/diet-plans/UpdateDietPlanUseCase");
const PrismaDietPlanRepository_1 = require("../../infrastructure/repositories/PrismaDietPlanRepository");
const response_1 = require("../../shared/utils/response");
const repository = new PrismaDietPlanRepository_1.PrismaDietPlanRepository();
const createUseCase = new CreateDietPlanUseCase_1.CreateDietPlanUseCase(repository);
const updateUseCase = new UpdateDietPlanUseCase_1.UpdateDietPlanUseCase(repository);
class DietPlanCrudController {
    static async create(req, res) {
        const plan = await createUseCase.execute({
            nutritionistUserId: req.user.userId,
            ...req.body,
        });
        return (0, response_1.ok)(res, plan, 201);
    }
    static async list(req, res) {
        const plans = await repository.listByNutritionist(req.user.userId);
        return (0, response_1.ok)(res, plans);
    }
    static async getById(req, res) {
        const id = String(req.params.id ?? "");
        const plan = await repository.getById(id, req.user.userId);
        if (!plan)
            return (0, response_1.fail)(res, "Diet plan not found", 404);
        return (0, response_1.ok)(res, plan);
    }
    static async update(req, res) {
        const id = String(req.params.id ?? "");
        const updated = await updateUseCase.execute({
            id,
            nutritionistUserId: req.user.userId,
            ...req.body,
        });
        if (!updated)
            return (0, response_1.fail)(res, "Diet plan not found", 404);
        return (0, response_1.ok)(res, updated);
    }
    static async remove(req, res) {
        const id = String(req.params.id ?? "");
        await repository.softDelete(id, req.user.userId);
        return (0, response_1.ok)(res, { message: "Diet plan soft deleted" });
    }
}
exports.DietPlanCrudController = DietPlanCrudController;
//# sourceMappingURL=DietPlanCrudController.js.map