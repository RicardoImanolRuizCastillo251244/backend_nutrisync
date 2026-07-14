import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { fail } from "@/shared/utils/response";

export const validateBody = <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return fail(res, "Validation error", 422, result.error.issues);
    }

    req.body = result.data;
    return next();
  };
