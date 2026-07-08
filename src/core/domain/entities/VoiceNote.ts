export interface VoiceNoteEntity {
  id: string;
  patientUserId: string;
  mealLogId: string;
  storageKey: string;
  publicUrl: string;
  durationSec: number | null;
  createdAt: Date;
}