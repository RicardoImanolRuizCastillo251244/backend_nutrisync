import type { UserEntity } from "@/modules/auth/domain/entities/User";

export interface AuthRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(data: { email: string; name: string; passwordHash: string; role: "nutritionist" | "patient" }): Promise<UserEntity>;
}