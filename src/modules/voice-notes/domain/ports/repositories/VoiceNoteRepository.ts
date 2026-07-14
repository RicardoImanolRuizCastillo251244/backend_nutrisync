import type { VoiceNoteEntity } from "@/modules/voice-notes/domain/entities/VoiceNote";

export interface CreateVoiceNoteInput {
  patientUserId: string;
  mealLogId: string;
  storageKey: string;
  publicUrl: string;
  durationSec?: number | null;
}

export interface VoiceNoteRepository {
  create(data: CreateVoiceNoteInput): Promise<VoiceNoteEntity>;
  findById(id: string): Promise<VoiceNoteEntity | null>;
  listByPatient(patientUserId: string): Promise<VoiceNoteEntity[]>;
  delete(id: string, patientUserId: string): Promise<void>;
}