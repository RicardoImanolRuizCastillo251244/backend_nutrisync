import jwt from "jsonwebtoken";
import { env } from "@/shared/config/env";
import type { Role } from "@/shared/constants/roles";

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  patientId?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
}

const accessExpiresIn = env.JWT_ACCESS_EXPIRES_IN as NonNullable<jwt.SignOptions["expiresIn"]>;
const refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN as NonNullable<jwt.SignOptions["expiresIn"]>;

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: accessExpiresIn });

export const signRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: refreshExpiresIn });

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
