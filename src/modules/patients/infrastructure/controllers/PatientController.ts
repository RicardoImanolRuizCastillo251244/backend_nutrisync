import type { Request, Response } from "express";
import { PrismaPatientRepository } from "@/modules/patients/infrastructure/repositories/PrismaPatientRepository";
import { hashPassword } from "@/shared/infrastructure/security/hash";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaPatientRepository();

export class PatientController {
  // GET / -> listar pacientes asignados al nutriólogo autenticado
  static async list(req: Request, res: Response) {
    try {
      const patients = await repository.listByNutritionist(req.user!.userId);
      return ok(res, patients);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  // GET /pending -> listar pacientes pendientes de aprobación
  static async listPending(req: Request, res: Response) {
    try {
      const patients = await repository.listPending();
      return ok(res, patients);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  // GET /:id
  static async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const patient = await repository.findById(id);
      if (!patient) return fail(res, "Patient not found", 404);
      return ok(res, patient);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  // POST / -> crear paciente (User + Patient)
  static async create(req: Request, res: Response) {
    try {
      const { email, password, name, phone, birthDate, gender } = req.body;
      if (!email || !password || !name) {
        return fail(res, "email, password y name son requeridos", 400);
      }
      const passwordHash = await hashPassword(password);
      const patient = await repository.createPatientWithUser({
        email,
        passwordHash,
        name,
        phone: phone ?? null,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender ?? null,
      });
      return ok(res, patient, 201);
    } catch (error: any) {
      if (error?.code === "P2002") return fail(res, "El email ya está registrado", 409);
      return fail(res, error instanceof Error ? error.message : "Error al crear paciente", 500);
    }
  }

  // PATCH /:id
  static async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const updated = await repository.update(id, req.body);
      if (!updated) return fail(res, "Patient not found", 404);
      return ok(res, updated);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  // DELETE /:id
  static async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      await repository.softDelete(id);
      return ok(res, { message: "Patient deleted" });
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  // POST /:id/approve -> aprobar paciente (asignar nutriólogo)
  static async approve(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const linked = await repository.linkToNutritionist(id, req.user!.userId);
      return ok(res, linked);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  // POST /:patientId/link -> alias legacy
  static async linkToNutritionist(req: Request, res: Response) {
    return PatientController.approve(req, res);
  }
}