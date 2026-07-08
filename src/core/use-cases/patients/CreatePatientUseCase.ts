import type { PatientRepository } from "../../repositories/PatientRepository";
import { hashPassword } from "../../../shared/utils/hash";

interface Input {
  nutritionistUserId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
}

export class CreatePatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(input: Input) {
    const passwordHash = await hashPassword(input.password);

    const payload = {
      nutritionistUserId: input.nutritionistUserId,
      email: input.email,
      passwordHash,
      name: input.name,
      ...(input.phone ? { phone: input.phone } : {}),
      ...(input.birthDate ? { birthDate: new Date(input.birthDate) } : {}),
      ...(input.gender ? { gender: input.gender } : {}),
    };

    return this.patientRepository.create(payload);
  }
}
