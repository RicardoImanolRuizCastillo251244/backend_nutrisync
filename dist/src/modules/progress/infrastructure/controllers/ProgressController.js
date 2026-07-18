"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const LogProgressUseCase_1 = require("../../../../modules/progress/application/use-cases/LogProgressUseCase");
const PrismaProgressLogRepository_1 = require("../../../../modules/progress/infrastructure/repositories/PrismaProgressLogRepository");
const response_1 = require("../../../../shared/utils/response");
const repository = new PrismaProgressLogRepository_1.PrismaProgressLogRepository();
const logProgressUseCase = new LogProgressUseCase_1.LogProgressUseCase(repository);
class ProgressController {
    static async log(req, res) {
        try {
            const entry = await logProgressUseCase.execute({
                patientUserId: req.user.userId,
                ...req.body,
            });
            return (0, response_1.ok)(res, entry, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al registrar progreso";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async getMyHistory(req, res) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 30;
            const logs = await repository.listByPatient(req.user.userId, limit);
            return (0, response_1.ok)(res, logs);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener historial";
            return (0, response_1.fail)(res, message, 500);
        }
    }
    static async getPatientHistory(req, res) {
        try {
            const patientUserId = String(req.params.patientUserId ?? "");
            const patient = await repository.findPatientByUserId(patientUserId);
            if (!patient)
                return (0, response_1.fail)(res, "Patient not found", 404);
            const limit = req.query.limit ? Number(req.query.limit) : 30;
            const logs = await repository.listByPatient(patientUserId, limit);
            return (0, response_1.ok)(res, logs);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener historial";
            return (0, response_1.fail)(res, message, 500);
        }
    }
}
exports.ProgressController = ProgressController;
//# sourceMappingURL=ProgressController.js.map