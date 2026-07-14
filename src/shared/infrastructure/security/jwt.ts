import jwt from "jsonwebtoken";
import { env } from "@/shared/config/env";

export function signAccessToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): Record<string, unknown> {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as Record<string, unknown>;
}

export function verifyRefreshToken(token: string): Record<string, unknown> {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as Record<string, unknown>;
}