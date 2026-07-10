import type { UserEntity } from "../domain/entities/User";

export interface AuthRepository {
  findUserByEmail(email: string): Promise<(UserEntity & { passwordHash: string; patientProfileId: string | undefined; patientNutritionistId: string | null | undefined }) | null>;
  findUserById(id: string): Promise<UserEntity | null>;
}
