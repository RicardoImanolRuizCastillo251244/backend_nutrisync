"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const PrismaPatientRepository_1 = require("../../../../modules/patients/infrastructure/repositories/PrismaPatientRepository");
const hash_1 = require("../../../../shared/infrastructure/security/hash");
const response_1 = require("../../../../shared/utils/response");
const repository = new PrismaPatientRepository_1.PrismaPatientRepository();
class PatientController {
    // GET / -> listar pacientes asignados al nutriólogo autenticado
    static async list(req, res) {
        try {
            const patients = await repository.listByNutritionist(req.user.userId);
            return (0, response_1.ok)(res, patients);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    // GET /pending -> listar pacientes pendientes de aprobación
    static async listPending(req, res) {
        try {
            const patients = await repository.listPending();
            return (0, response_1.ok)(res, patients);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    // GET /:id
    static async getById(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const patient = await repository.findById(id);
            if (!patient)
                return (0, response_1.fail)(res, "Patient not found", 404);
            return (0, response_1.ok)(res, patient);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    // POST / -> crear paciente (User + Patient)
    static async create(req, res) {
        try {
            const { email, password, name, phone, birthDate, gender } = req.body;
            if (!email || !password || !name) {
                return (0, response_1.fail)(res, "email, password y name son requeridos", 400);
            }
            const passwordHash = await (0, hash_1.hashPassword)(password);
            const patient = await repository.createPatientWithUser({
                email,
                passwordHash,
                name,
                phone: phone ?? null,
                birthDate: birthDate ? new Date(birthDate) : null,
                gender: gender ?? null,
            });
            return (0, response_1.ok)(res, patient, 201);
        }
        catch (error) {
            if (error?.code === "P2002")
                return (0, response_1.fail)(res, "El email ya está registrado", 409);
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error al crear paciente", 500);
        }
    }
    // PATCH /:id
    static async update(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const updated = await repository.update(id, req.body);
            if (!updated)
                return (0, response_1.fail)(res, "Patient not found", 404);
            return (0, response_1.ok)(res, updated);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    // DELETE /:id
    static async remove(req, res) {
        try {
            const id = String(req.params.id ?? "");
            await repository.softDelete(id);
            return (0, response_1.ok)(res, { message: "Patient deleted" });
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    // POST /:id/approve -> aprobar paciente (asignar nutriólogo)
    static async approve(req, res) {
        try {
            const id = String(req.params.id ?? "");
            const linked = await repository.linkToNutritionist(id, req.user.userId);
            return (0, response_1.ok)(res, linked);
        }
        catch (error) {
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error", 500);
        }
    }
    // POST /:patientId/link -> alias legacy
    static async linkToNutritionist(req, res) {
        return PatientController.approve(req, res);
    }
}
exports.PatientController = PatientController;
//# sourceMappingURL=PatientController.js.map