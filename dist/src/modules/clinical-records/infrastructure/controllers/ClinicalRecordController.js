"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalRecordController = void 0;
const CreateClinicalRecordUseCase_1 = require("../../../../modules/clinical-records/application/use-cases/CreateClinicalRecordUseCase");
const UpdateClinicalRecordUseCase_1 = require("../../../../modules/clinical-records/application/use-cases/UpdateClinicalRecordUseCase");
const CalculateClinicalMetrics_1 = require("../../../../modules/clinical-records/domain/services/CalculateClinicalMetrics");
const PrismaClinicalRecordRepository_1 = require("../../../../modules/clinical-records/infrastructure/repositories/PrismaClinicalRecordRepository");
const response_1 = require("../../../../shared/utils/response");
const repository = new PrismaClinicalRecordRepository_1.PrismaClinicalRecordRepository();
const createUseCase = new CreateClinicalRecordUseCase_1.CreateClinicalRecordUseCase(repository);
const updateUseCase = new UpdateClinicalRecordUseCase_1.UpdateClinicalRecordUseCase(repository);
class ClinicalRecordController {
    static async create(req, res) {
        try {
            const body = req.body;
            const input = { ...body, date: body.date ? new Date(body.date) : new Date() };
            const record = await createUseCase.execute(input);
            return (0, response_1.ok)(res, record, 201);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async list(req, res) {
        try {
            const patientId = String(req.params.patientId ?? "");
            const records = await repository.listByPatient(patientId);
            return (0, response_1.ok)(res, records);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async getById(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const patientId = String(req.params.patientId ?? req.query.patientId ?? "");
            const record = await repository.getById(id, patientId);
            if (!record)
                return (0, response_1.fail)(res, "Clinical record not found", 404);
            return (0, response_1.ok)(res, record);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async update(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const body = req.body;
            const patientId = String(body.patientId ?? req.params.patientId ?? "");
            const updated = await updateUseCase.execute({ id, patientId, ...req.body, ...(typeof body.date === "string" ? { date: new Date(body.date) } : {}) });
            if (!updated)
                return (0, response_1.fail)(res, "Clinical record not found", 404);
            return (0, response_1.ok)(res, updated);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async remove(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const body = req.body;
            const patientId = String(body.patientId ?? req.params.patientId ?? "");
            await repository.softDelete(id, patientId);
            return (0, response_1.ok)(res, { message: "Clinical record deleted" });
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async getMetrics(req, res) {
        try {
            const patientId = req.user.patientId;
            if (!patientId)
                return (0, response_1.fail)(res, "No tienes un perfil de paciente asociado", 403);
            const records = await repository.listByPatient(patientId);
            if (records.length === 0)
                return (0, response_1.ok)(res, null);
            const latest = records.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
            return (0, response_1.ok)(res, latest ?? null);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 502);
        }
    }
    static async upsertMetrics(req, res) {
        try {
            const patientId = req.user.patientId;
            if (!patientId)
                return (0, response_1.fail)(res, "No tienes un perfil de paciente asociado", 403);
            const { weightKg, heightCm, dateOfBirth, gender, name } = req.body;
            if (!weightKg || !heightCm || !dateOfBirth || !gender)
                return (0, response_1.fail)(res, "Faltan datos: weightKg, heightCm, dateOfBirth, gender", 400);
            const birthDate = new Date(dateOfBirth);
            const now = new Date();
            let age = now.getFullYear() - birthDate.getFullYear();
            const m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate()))
                age--;
            const calculator = new CalculateClinicalMetrics_1.CalculateClinicalMetrics();
            const metrics = calculator.execute({ weightKg: Number(weightKg), heightCm: Number(heightCm), age, gender: gender });
            const existingRecords = await repository.listByPatient(patientId);
            const todayStr = now.toISOString().slice(0, 10);
            const todayRecord = existingRecords.find(r => r.date.toISOString().slice(0, 10) === todayStr);
            const data = { name: String(name ?? ''), weightKg: Number(weightKg), heightCm: Number(heightCm), age, sex: gender === "male" ? "Masculino" : "Femenino", ...metrics };
            if (todayRecord) {
                const updated = await repository.update(todayRecord.id, patientId, data);
                return (0, response_1.ok)(res, updated);
            }
            const created = await repository.create({ patientId, date: new Date(), ...data });
            return (0, response_1.ok)(res, created, 201);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 502);
        }
    }
}
exports.ClinicalRecordController = ClinicalRecordController;
//# sourceMappingURL=ClinicalRecordController.js.map