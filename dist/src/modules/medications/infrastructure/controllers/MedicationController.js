"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationController = void 0;
const CreateMedicationUseCase_1 = require("../../../../modules/medications/application/use-cases/CreateMedicationUseCase");
const UpdateMedicationUseCase_1 = require("../../../../modules/medications/application/use-cases/UpdateMedicationUseCase");
const LogMedicationTakeUseCase_1 = require("../../../../modules/medications/application/use-cases/LogMedicationTakeUseCase");
const PrismaMedicationRepository_1 = require("../../../../modules/medications/infrastructure/repositories/PrismaMedicationRepository");
const response_1 = require("../../../../shared/utils/response");
const repository = new PrismaMedicationRepository_1.PrismaMedicationRepository();
const createUseCase = new CreateMedicationUseCase_1.CreateMedicationUseCase(repository);
const updateUseCase = new UpdateMedicationUseCase_1.UpdateMedicationUseCase(repository);
const logTakeUseCase = new LogMedicationTakeUseCase_1.LogMedicationTakeUseCase(repository);
class MedicationController {
    static async create(req, res) {
        try {
            const med = await createUseCase.execute({
                patientUserId: req.user.userId,
                ...req.body,
            });
            return (0, response_1.ok)(res, med, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al crear medicación";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async list(req, res) {
        try {
            const meds = await repository.listByPatient(req.user.userId);
            return (0, response_1.ok)(res, meds);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al listar medicaciones";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async getById(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const med = await repository.getById(id, req.user.userId);
            if (!med)
                return (0, response_1.fail)(res, "Medication not found", 404);
            return (0, response_1.ok)(res, med);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener medicación";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async update(req, res) {
        try {
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
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al actualizar medicación";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async remove(req, res) {
        try {
            const id = String(req.params.id ?? "");
            await repository.delete(id, req.user.userId);
            return (0, response_1.ok)(res, { message: "Medication deleted" });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al eliminar medicación";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async logTake(req, res) {
        try {
            const medicationId = String(req.params.id ?? "");
            const take = await logTakeUseCase.execute({
                medicationId,
                patientUserId: req.user.userId,
            });
            return (0, response_1.ok)(res, take, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al registrar toma";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async listTakes(req, res) {
        try {
            const medicationId = String(req.params.id ?? "");
            const takes = await repository.listTakes(medicationId, req.user.userId);
            return (0, response_1.ok)(res, takes);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al listar tomas";
            return (0, response_1.fail)(res, message, 500);
        }
    }
}
exports.MedicationController = MedicationController;
//# sourceMappingURL=MedicationController.js.map