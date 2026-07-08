export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface SessionRepository {
  createSession(userId: string, tokenHash: string, expiresAt: Date): Promise<SessionRecord>;
  findByTokenHash(tokenHash: string): Promise<SessionRecord | null>;
  revokeSession(id: string): Promise<void>;
  replaceSession(id: string, replacementSessionId: string): Promise<void>;
}
