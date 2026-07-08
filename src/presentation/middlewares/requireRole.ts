import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../shared/constants/roles";
import { fail } from "../../shared/utils/response";

export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return fail(res, "Unauthorized", 401);
    if (!roles.includes(req.user.role)) return fail(res, "Forbidden", 403);
    return next();
  };
