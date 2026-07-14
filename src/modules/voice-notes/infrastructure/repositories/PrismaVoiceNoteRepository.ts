import type { VoiceNoteRepository, CreateVoiceNoteInput } from "@/modules/voice-notes/domain/ports/repositories/VoiceNoteRepository";
import type { VoiceNoteEntity } from "@/modules/voice-notes/domain/entities/VoiceNote";
import { prisma } from "@/shared/infrastructure/database/prisma";

export class PrismaVoiceNoteRepository implements VoiceNoteRepository {
  async create(data: CreateVoiceNoteInput): Promise<VoiceNoteEntity> {
    const note = await prisma.voiceNote.create({ data });
    return note as VoiceNoteEntity;
  }

  async findById(id: string): Promise<VoiceNoteEntity | null> {
    const note = await prisma.voiceNote.findUnique({ where: { id } });
    return note as VoiceNoteEntity | null;
  }

  async listByPatient(patientUserId: string): Promise<VoiceNoteEntity[]> {
    const notes = await prisma.voiceNote.findMany({
      where: { patientUserId },
      orderBy: { createdAt: "desc" },
    });
    return notes as VoiceNoteEntity[];
  }

  async delete(id: string, patientUserId: string): Promise<void> {
    await prisma.voiceNote.deleteMany({
      where: { id, patientUserId },
    });
  }
}