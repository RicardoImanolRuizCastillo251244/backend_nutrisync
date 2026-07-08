import type { VoiceNoteEntity } from "../domain/entities/VoiceNote";

export interface VoiceNoteRepository {
  listByPatient(patientUserId: string): Promise<VoiceNoteEntity[]>;
  listByMealLog(mealLogId: string, patientUserId: string): Promise<VoiceNoteEntity[]>;
  delete(id: string, patientUserId: string): Promise<boolean>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}