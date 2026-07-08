"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalRecordController = void 0;
const CreateClinicalRecordUseCase_1 = require("../../core/use-cases/clinical-records/CreateClinicalRecordUseCase");
const UpdateClinicalRecordUseCase_1 = require("../../core/use-cases/clinical-records/UpdateClinicalRecordUseCase");
const PrismaClinicalRecordRepository_1 = require("../../infrastructure/repositories/PrismaClinicalRecordRepository");
const response_1 = require("../../shared/utils/response");
const repository = new PrismaClinicalRecordRepository_1.PrismaClinicalRecordRepository();
const createUseCase = new CreateClinicalRecordUseCase_1.CreateClinicalRecordUseCase(repository);
const updateUseCase = new UpdateClinicalRecordUseCase_1.UpdateClinicalRecordUseCase(repository);
class ClinicalRecordController {
    static async create(req, res) {
        const record = await createUseCase.execute(req.body);
        return (0, response_1.ok)(res, record, 201);
    }
    static async list(req, res) {
        const patientId = String(req.params.patientId ?? "");
        const records = await repository.listByPatient(patientId);
        return (0, response_1.ok)(res, records);
    }
    static async getById(req, res) {
        const id = String(req.params.id ?? "");
        const patientId = String(req.params.patientId ?? "");
        const record = await repository.getById(id, patientId);
        if (!record)
            return (0, response_1.fail)(res, "Clinical record not found", 404);
        return (0, response_1.ok)(res, record);
    }
    static async update(req, res) {
        const id = String(req.params.id ?? "");
        const patientId = String(req.params.patientId ?? "");
        const updated = await updateUseCase.execute({
            id,
            patientId,
            ...req.body,
        });
        if (!updated)
            return (0, response_1.fail)(res, "Clinical record not found", 404);
        return (0, response_1.ok)(res, updated);
    }
    static async remove(req, res) {
        const id = String(req.params.id ?? "");
        const patientId = String(req.params.patientId ?? "");
        await repository.softDelete(id, patientId);
        return (0, response_1.ok)(res, { message: "Clinical record deleted" });
    }
    static async recalculate(req, res) {
        const id = String(req.params.id ?? "");
        const patientId = String(req.params.patientId ?? "");
        const existing = await repository.getById(id, patientId);
        if (!existing)
            return (0, response_1.fail)(res, "Clinical record not found", 404);
        const updateData = req.body;
        const updated = await updateUseCase.execute({
            id,
            patientId,
            data: updateData,
        });
        if (!updated)
            return (0, response_1.fail)(res, "Clinical record not found", 404);
        return (0, response_1.ok)(res, updated);
    }
}
exports.ClinicalRecordController = ClinicalRecordController;
//# sourceMappingURL=ClinicalRecordController.js.map