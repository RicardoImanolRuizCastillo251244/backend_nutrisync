import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "@/shared/utils/jwt";
import { fail } from "@/shared/utils/response";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return fail(res, "Missing bearer token", 401);
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.sub,
      role: payload.role,
      ...(payload.patientId ? { patientId: payload.patientId } : {}),
    };
    return next();
  } catch {
    return fail(res, "Invalid token", 401);
  }
};
