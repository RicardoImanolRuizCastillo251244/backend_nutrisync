"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdherenceController = void 0;
const LogMealUseCase_1 = require("../../../../modules/adherence/application/use-cases/LogMealUseCase");
const LogHydrationUseCase_1 = require("../../../../modules/adherence/application/use-cases/LogHydrationUseCase");
const LogMoodUseCase_1 = require("../../../../modules/adherence/application/use-cases/LogMoodUseCase");
const GetAdherenceSummaryUseCase_1 = require("../../../../modules/adherence/application/use-cases/GetAdherenceSummaryUseCase");
const PrismaAdherenceRepository_1 = require("../../../../modules/adherence/infrastructure/repositories/PrismaAdherenceRepository");
const PrismaPatientRepository_1 = require("../../../../modules/patients/infrastructure/repositories/PrismaPatientRepository");
const response_1 = require("../../../../shared/utils/response");
const repository = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
const patientRepo = new PrismaPatientRepository_1.PrismaPatientRepository();
const logMealUseCase = new LogMealUseCase_1.LogMealUseCase(repository);
const logHydrationUseCase = new LogHydrationUseCase_1.LogHydrationUseCase(repository);
const logMoodUseCase = new LogMoodUseCase_1.LogMoodUseCase(repository);
const getSummaryUseCase = new GetAdherenceSummaryUseCase_1.GetAdherenceSummaryUseCase(repository);
/**
 * Resuelve el patientUserId real (FK de la tabla User) a partir de:
 * 1. req.user.userId si es un paciente autenticado (propia adherencia)
 * 2. req.query.patientId → busca el Patient y devuelve su userId
 * 3. req.params.patientUserId → busca como Patient o lo usa directo
 */
async function getPatientUserId(req) {
    // Si viene patientId en query (nutriólogo consultando), resolver a userId
    if (req.query.patientId) {
        const patientId = String(req.query.patientId);
        const patient = await patientRepo.findById(patientId);
        if (patient)
            return patient.userId;
    }
    // Si viene en params como patientUserId, intentar resolver
    if (req.params.patientUserId) {
        const param = String(req.params.patientUserId);
        const patient = await patientRepo.findById(param);
        if (patient)
            return patient.userId;
        return param; // Asumir que ya es un userId directo
    }
    // Fallback: el userId del token (paciente autenticado)
    return req.user.userId;
}
class AdherenceController {
    static async logMeal(req, res) {
        try {
            const patientUserId = await getPatientUserId(req);
            const log = await logMealUseCase.execute({ patientUserId, ...req.body });
            return (0, response_1.ok)(res, log, 201);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async logHydration(req, res) {
        try {
            const patientUserId = await getPatientUserId(req);
            const log = await logHydrationUseCase.execute({ patientUserId, ...req.body });
            return (0, response_1.ok)(res, log, 201);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async logMood(req, res) {
        try {
            const patientUserId = await getPatientUserId(req);
            const log = await logMoodUseCase.execute({ patientUserId, ...req.body });
            return (0, response_1.ok)(res, log, 201);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async getSummary(req, res) {
        try {
            const patientUserId = await getPatientUserId(req);
            const days = req.query.days ? Number(req.query.days) : 30;
            const from = new Date();
            from.setDate(from.getDate() - days);
            const summary = await repository.getSummaryInRange(patientUserId, from);
            return (0, response_1.ok)(res, summary);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async listMeals(req, res) {
        try {
            const patientUserId = await getPatientUserId(req);
            const date = req.query.date ? new Date(req.query.date) : undefined;
            const logs = await repository.listMealLogs(patientUserId, date);
            return (0, response_1.ok)(res, logs);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async listHydration(req, res) {
        try {
            const patientUserId = await getPatientUserId(req);
            const date = req.query.date ? new Date(req.query.date) : undefined;
            const logs = await repository.listHydrationLogs(patientUserId, date);
            return (0, response_1.ok)(res, logs);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async updateMeal(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const updated = await repository.updateMealLog(id, req.body);
            if (!updated)
                return (0, response_1.fail)(res, "Meal log not found", 404);
            return (0, response_1.ok)(res, updated);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    static async listMood(req, res) {
        try {
            const patientUserId = await getPatientUserId(req);
            const date = req.query.date ? new Date(req.query.date) : undefined;
            const logs = await repository.listMoodLogs(patientUserId, date);
            return (0, response_1.ok)(res, logs);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
}
exports.AdherenceController = AdherenceController;
//# sourceMappingURL=AdherenceController.js.map