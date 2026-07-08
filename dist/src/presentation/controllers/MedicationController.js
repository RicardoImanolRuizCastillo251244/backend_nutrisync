"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationController = void 0;
const CreateMedicationUseCase_1 = require("../../core/use-cases/medication/CreateMedicationUseCase");
const UpdateMedicationUseCase_1 = require("../../core/use-cases/medication/UpdateMedicationUseCase");
const LogMedicationTakeUseCase_1 = require("../../core/use-cases/medication/LogMedicationTakeUseCase");
const PrismaMedicationRepository_1 = require("../../infrastructure/repositories/PrismaMedicationRepository");
const response_1 = require("../../shared/utils/response");
const repository = new PrismaMedicationRepository_1.PrismaMedicationRepository();
const createUseCase = new CreateMedicationUseCase_1.CreateMedicationUseCase(repository);
const updateUseCase = new UpdateMedicationUseCase_1.UpdateMedicationUseCase(repository);
const logTakeUseCase = new LogMedicationTakeUseCase_1.LogMedicationTakeUseCase(repository);
class MedicationController {
    static async create(req, res) {
        const med = await createUseCase.execute({
            patientUserId: req.user.userId,
            ...req.body,
        });
        return (0, response_1.ok)(res, med, 201);
    }
    static async list(req, res) {
        const meds = await repository.listByPatient(req.user.userId);
        return (0, response_1.ok)(res, meds);
    }
    static async getById(req, res) {
        const id = String(req.params.id ?? "");
        const med = await repository.getById(id, req.user.userId);
        if (!med)
            return (0, response_1.fail)(res, "Medication not found", 404);
        return (0, response_1.ok)(res, med);
    }
    static async update(req, res) {
        const id = String(req.params.id ?? "");
        const updated = await updateUseCase.execute({
            id,
            patientUserId: req.user.userId,
            ...req.body,
        });
        if (!updated)
            return (0, response_1.fail)(res, "Medication not found", 404);
        return (0, response_1.ok)(res, updated);
    }
    static async remove(req, res) {
        const id = String(req.params.id ?? "");
        await repository.delete(id, req.user.userId);
        return (0, response_1.ok)(res, { message: "Medication deleted" });
    }
    static async logTake(req, res) {
        const medicationId = String(req.params.id ?? "");
        try {
            const take = await logTakeUseCase.execute({
                medicationId,
                patientUserId: req.user.userId,
            });
            return (0, response_1.ok)(res, take, 201);
        }
        catch {
            return (0, response_1.fail)(res, "Medication not found", 404);
        }
    }
    static async listTakes(req, res) {
        const medicationId = String(req.params.id ?? "");
        try {
            const takes = await repository.listTakes(medicationId, req.user.userId);
            return (0, response_1.ok)(res, takes);
        }
        catch {
            return (0, response_1.fail)(res, "Medication not found", 404);
        }
    }
}
exports.MedicationController = MedicationController;
//# sourceMappingURL=MedicationController.js.map