"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdherenceController = void 0;
const LogMealUseCase_1 = require("../../core/use-cases/adherence/LogMealUseCase");
const LogHydrationUseCase_1 = require("../../core/use-cases/adherence/LogHydrationUseCase");
const LogMoodUseCase_1 = require("../../core/use-cases/adherence/LogMoodUseCase");
const GetAdherenceSummaryUseCase_1 = require("../../core/use-cases/adherence/GetAdherenceSummaryUseCase");
const PrismaAdherenceRepository_1 = require("../../infrastructure/repositories/PrismaAdherenceRepository");
const response_1 = require("../../shared/utils/response");
const repository = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
const logMealUseCase = new LogMealUseCase_1.LogMealUseCase(repository);
const logHydrationUseCase = new LogHydrationUseCase_1.LogHydrationUseCase(repository);
const logMoodUseCase = new LogMoodUseCase_1.LogMoodUseCase(repository);
const summaryUseCase = new GetAdherenceSummaryUseCase_1.GetAdherenceSummaryUseCase(repository);
class AdherenceController {
    static async logMeal(req, res) {
        const log = await logMealUseCase.execute({
            patientUserId: req.user.userId,
            ...req.body,
        });
        return (0, response_1.ok)(res, log, 201);
    }
    static async logHydration(req, res) {
        const log = await logHydrationUseCase.execute({
            patientUserId: req.user.userId,
            ...req.body,
        });
        return (0, response_1.ok)(res, log, 201);
    }
    static async logMood(req, res) {
        const log = await logMoodUseCase.execute({
            patientUserId: req.user.userId,
            ...req.body,
        });
        return (0, response_1.ok)(res, log, 201);
    }
    static async getSummaryForNutritionist(req, res) {
        const patientUserId = String(req.params.patientId ?? "");
        const patient = await repository.findPatientByUserId(patientUserId);
        if (!patient)
            return (0, response_1.fail)(res, "Patient not found", 404);
        const summary = await summaryUseCase.execute({
            patientUserId: patientUserId,
            days: req.query.days ? Number(req.query.days) : 30,
        });
        return (0, response_1.ok)(res, summary);
    }
    static async getMySummary(req, res) {
        const summary = await summaryUseCase.execute({
            patientUserId: req.user.userId,
            days: req.query.days ? Number(req.query.days) : 30,
        });
        return (0, response_1.ok)(res, summary);
    }
}
exports.AdherenceController = AdherenceController;
//# sourceMappingURL=AdherenceController.js.map