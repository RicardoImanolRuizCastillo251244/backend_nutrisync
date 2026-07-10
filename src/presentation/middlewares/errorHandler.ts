import type { NextFunction, Request, Response } from "express";
import { DuplicateEmailError } from "../../shared/errors/DuplicateEmailError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof DuplicateEmailError) {
    return res.status(409).json({ success: false, error: { message: err.message } });
  }

  const message = err.message || "Internal server error";
  return res.status(500).json({ success: false, error: { message } });
};
