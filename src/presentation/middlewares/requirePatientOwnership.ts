import type { NextFunction, Request, Response } from "express";
import { fail } from "../../shared/utils/response";

export const requirePatientOwnership = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return fail(res, "Authentication required", 401);
  }

  // Nutritionists cannot access patient-only resources (medication, etc.)
  if (user.role === "nutritionist") {
    return fail(res, "Nutritionists cannot access patient-specific resources", 403);
  }

  // Patient must be accessing their own data
  const requestedPatientId = req.params.patientId;
  if (requestedPatientId && user.patientId && requestedPatientId !== user.patientId) {
    return fail(res, "You can only access your own patient data", 403);
  }

  return next();
};