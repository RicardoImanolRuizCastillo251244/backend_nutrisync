import type { Role } from "../../../shared/constants/roles";

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  role: Role;
  nutritionistId?: string | null;
  createdAt: Date;
}
