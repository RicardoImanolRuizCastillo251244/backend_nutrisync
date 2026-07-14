export interface SessionRepository {
  createSession(userId: string, refreshTokenHash: string, expiresAt: Date): Promise<void>;
}