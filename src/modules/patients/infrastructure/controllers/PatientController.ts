import type { Request, Response } from "express";
import { PrismaPatientRepository } from "@/modules/patients/infrastructure/repositories/PrismaPatientRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaPatientRepository();

export class PatientController {
  static async list(req: Request, res: Response) {
    try {
      const patients = await repository.listByNutritionist(req.user!.userId);
      return ok(res, patients);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

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

  static async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      await repository.softDelete(id);
      return ok(res, { message: "Patient deleted" });
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async linkToNutritionist(req: Request, res: Response) {
    try {
      const patientId = String(req.params.patientId ?? "");
      const linked = await repository.linkToNutritionist(patientId, req.user!.userId);
      return ok(res, linked);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }
}