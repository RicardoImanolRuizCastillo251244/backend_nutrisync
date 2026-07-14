import type { Role } from "@/shared/constants/roles";

declare global {
  namespace Express {
    interface UserContext {
      userId: string;
      role: Role;
      patientId?: string;
    }

    interface Request {
      user?: UserContext;
    }
  }
}

export {};
