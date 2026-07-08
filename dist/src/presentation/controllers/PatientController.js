"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const CreatePatientUseCase_1 = require("../../core/use-cases/patients/CreatePatientUseCase");
const PrismaPatientRepository_1 = require("../../infrastructure/repositories/PrismaPatientRepository");
const response_1 = require("../../shared/utils/response");
const patientRepository = new PrismaPatientRepository_1.PrismaPatientRepository();
const createPatientUseCase = new CreatePatientUseCase_1.CreatePatientUseCase(patientRepository);
class PatientController {
    static async create(req, res) {
        const nutritionistUserId = req.user.userId;
        const patient = await createPatientUseCase.execute({
            nutritionistUserId,
            ...req.body,
        });
        return (0, response_1.ok)(res, patient, 201);
    }
    static async list(req, res) {
        const patients = await patientRepository.listByNutritionist(req.user.userId);
        return (0, response_1.ok)(res, patients);
    }
    static async getById(req, res) {
        const id = String(req.params.id ?? "");
        const patient = await patientRepository.getById(id, req.user.userId);
        return (0, response_1.ok)(res, patient);
    }
    static async update(req, res) {
        const id = String(req.params.id ?? "");
        const updated = await patientRepository.update(id, req.user.userId, {
            ...req.body,
            birthDate: req.body.birthDate ? new Date(req.body.birthDate) : undefined,
        });
        return (0, response_1.ok)(res, updated);
    }
    static async listPending(req, res) {
        const patients = await patientRepository.listPending();
        return (0, response_1.ok)(res, patients);
    }
    static async approve(req, res) {
        const id = String(req.params.id ?? "");
        const patient = await patientRepository.approve(id, req.user.userId);
        if (!patient)
            return (0, response_1.ok)(res, { message: "Patient not found or already approved" }, 404);
        return (0, response_1.ok)(res, patient);
    }
    static async remove(req, res) {
        const id = String(req.params.id ?? "");
        await patientRepository.softDelete(id, req.user.userId);
        return (0, response_1.ok)(res, { message: "Patient soft deleted" });
    }
}
exports.PatientController = PatientController;
//# sourceMappingURL=PatientController.js.map