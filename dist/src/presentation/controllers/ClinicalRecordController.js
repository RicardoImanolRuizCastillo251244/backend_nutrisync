"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalRecordController = void 0;
const CreateClinicalRecordUseCase_1 = require("../../core/use-cases/clinical-records/CreateClinicalRecordUseCase");
const UpdateClinicalRecordUseCase_1 = require("../../core/use-cases/clinical-records/UpdateClinicalRecordUseCase");
const CalculateClinicalMetrics_1 = require("../../core/use-cases/clinical-records/CalculateClinicalMetrics");
const PrismaClinicalRecordRepository_1 = require("../../infrastructure/repositories/PrismaClinicalRecordRepository");
const response_1 = require("../../shared/utils/response");
const repository = new PrismaClinicalRecordRepository_1.PrismaClinicalRecordRepository();
const createUseCase = new CreateClinicalRecordUseCase_1.CreateClinicalRecordUseCase(repository);
const updateUseCase = new UpdateClinicalRecordUseCase_1.UpdateClinicalRecordUseCase(repository);
function mapClinicalRecordError(error) {
    const code = error?.code;
    const message = error instanceof Error ? error.message : "Internal server error";
    const missingColumnPattern = /column .* does not exist/i;
    const clinicalRecordPattern = /clinicalrecord|clinical_record|"ClinicalRecord"/i;
    if (code === "P2022" || (missingColumnPattern.test(message) && clinicalRecordPattern.test(message))) {
        return {
            status: 503,
            message: "La base de datos no esta actualizada para ClinicalRecord. Ejecuta migraciones pendientes (prisma migrate deploy) y reinicia el backend.",
        };
    }
    return { status: 500, message };
}
class ClinicalRecordController {
    static async create(req, res) {
        try {
            const record = await createUseCase.execute(req.body);
            return (0, response_1.ok)(res, record, 201);
        }
        catch (error) {
            const mapped = mapClinicalRecordError(error);
            return (0, response_1.fail)(res, mapped.message, mapped.status);
        }
    }
    static async list(req, res) {
        try {
            const patientId = String(req.params.patientId ?? "");
            const records = await repository.listByPatient(patientId);
            return (0, response_1.ok)(res, records);
        }
        catch (error) {
            const mapped = mapClinicalRecordError(error);
            return (0, response_1.fail)(res, mapped.message, mapped.status);
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
            const mapped = mapClinicalRecordError(error);
            return (0, response_1.fail)(res, mapped.message, mapped.status);
        }
    }
    static async update(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const body = req.body;
            const patientId = String(body.patientId ?? req.params.patientId ?? "");
            const updated = await updateUseCase.execute({
                id,
                patientId,
                ...req.body,
                ...(typeof body.date === "string" ? { date: body.date } : {}),
            });
            if (!updated)
                return (0, response_1.fail)(res, "Clinical record not found", 404);
            return (0, response_1.ok)(res, updated);
        }
        catch (error) {
            const mapped = mapClinicalRecordError(error);
            return (0, response_1.fail)(res, mapped.message, mapped.status);
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
            const mapped = mapClinicalRecordError(error);
            return (0, response_1.fail)(res, mapped.message, mapped.status);
        }
    }
    static async getMetrics(req, res) {
        try {
            const patientId = req.user.patientId;
            if (!patientId) {
                return (0, response_1.fail)(res, "No tienes un perfil de paciente asociado", 403);
            }
            const records = await repository.listByPatient(patientId);
            if (records.length === 0) {
                return (0, response_1.ok)(res, null);
            }
            const latest = records.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
            if (!latest)
                return (0, response_1.ok)(res, null);
            return (0, response_1.ok)(res, latest);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener métricas";
            return (0, response_1.fail)(res, message, 502);
        }
    }
    static async upsertMetrics(req, res) {
        try {
            const patientId = req.user.patientId;
            if (!patientId) {
                return (0, response_1.fail)(res, "No tienes un perfil de paciente asociado", 403);
            }
            const { weightKg, heightCm, dateOfBirth, gender, name } = req.body;
            if (!weightKg || !heightCm || !dateOfBirth || !gender) {
                return (0, response_1.fail)(res, "Faltan datos: weightKg, heightCm, dateOfBirth, gender", 400);
            }
            const birthDate = new Date(dateOfBirth);
            const now = new Date();
            let age = now.getFullYear() - birthDate.getFullYear();
            const m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            const calculator = new CalculateClinicalMetrics_1.CalculateClinicalMetrics();
            const metrics = calculator.execute({
                weightKg: Number(weightKg),
                heightCm: Number(heightCm),
                age,
                gender: gender,
            });
            const existingRecords = await repository.listByPatient(patientId);
            const todayStr = now.toISOString().slice(0, 10);
            const todayRecord = existingRecords.find((r) => r.date.toISOString().slice(0, 10) === todayStr);
            const data = {
                name: String(name ?? ''),
                weightKg: Number(weightKg),
                heightCm: Number(heightCm),
                age,
                sex: gender === "male" ? "Masculino" : "Femenino",
                ...metrics,
            };
            if (todayRecord) {
                const updated = await repository.update(todayRecord.id, patientId, data);
                return (0, response_1.ok)(res, updated);
            }
            const created = await repository.create({
                patientId,
                date: new Date(),
                ...data,
            });
            return (0, response_1.ok)(res, created, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al guardar métricas";
            return (0, response_1.fail)(res, message, 502);
        }
    }
    static async recalculate(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const patientId = String(req.params.patientId ?? "");
            const existing = await repository.getById(id, patientId);
            if (!existing)
                return (0, response_1.fail)(res, "Clinical record not found", 404);
            const updateData = req.body;
            const updated = await updateUseCase.execute({
                id,
                patientId,
                ...updateData,
            });
            if (!updated)
                return (0, response_1.fail)(res, "Clinical record not found", 404);
            return (0, response_1.ok)(res, updated);
        }
        catch (error) {
            const mapped = mapClinicalRecordError(error);
            return (0, response_1.fail)(res, mapped.message, mapped.status);
        }
    }
}
exports.ClinicalRecordController = ClinicalRecordController;
//# sourceMappingURL=ClinicalRecordController.js.map