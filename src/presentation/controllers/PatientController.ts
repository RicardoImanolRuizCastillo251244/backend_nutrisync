import type { Request, Response } from "express";
import { CreatePatientUseCase } from "../../core/use-cases/patients/CreatePatientUseCase";
import { PrismaPatientRepository } from "../../infrastructure/repositories/PrismaPatientRepository";
import { ok, fail } from "../../shared/utils/response";

const patientRepository = new PrismaPatientRepository();
const createPatientUseCase = new CreatePatientUseCase(patientRepository);

export class PatientController {
  static async create(req: Request, res: Response) {
    const nutritionistUserId = req.user!.userId;
    const patient = await createPatientUseCase.execute({
      nutritionistUserId,
      ...req.body,
    });

    return ok(res, patient, 201);
  }

  static async list(req: Request, res: Response) {
    const patients = await patientRepository.listByNutritionist(req.user!.userId);
    return ok(res, patients);
  }

  static async getById(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const patient = await patientRepository.getById(id, req.user!.userId);
    return ok(res, patient);
  }

  static async update(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const updated = await patientRepository.update(id, req.user!.userId, {
      ...req.body,
      birthDate: req.body.birthDate ? new Date(req.body.birthDate) : undefined,
    });

    return ok(res, updated);
  }

  static async listPending(req: Request, res: Response) {
    const patients = await patientRepository.listPending();
    return ok(res, patients);
  }

  static async approve(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const patient = await patientRepository.approve(id, req.user!.userId);
    if (!patient) return ok(res, { message: "Patient not found or already approved" }, 404);
    return ok(res, patient);
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const deleted = await patientRepository.hardDelete(id, req.user!.userId);
    if (!deleted) {
      return fail(res, "Patient not found", 404);
    }

    return ok(res, { message: "Patient permanently deleted" });
  }
}
