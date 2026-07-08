import type { Response } from "express";

export const ok = <T>(res: Response, data: T, status = 200): Response =>
  res.status(status).json({ success: true, data });

export const fail = (res: Response, message: string, status = 400, details?: unknown): Response =>
  res.status(status).json({ success: false, error: { message, details } });
