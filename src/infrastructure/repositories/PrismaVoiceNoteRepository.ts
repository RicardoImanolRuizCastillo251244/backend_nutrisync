import type { VoiceNoteRepository } from "../../core/repositories/VoiceNoteRepository";
import { prisma } from "../database/prisma";
import { SupabaseStorageService } from "../storage/SupabaseStorageService";

const storage = new SupabaseStorageService();

export class PrismaVoiceNoteRepository implements VoiceNoteRepository {
  async listByPatient(patientUserId: string) {
    return prisma.voiceNote.findMany({
      where: { patientUserId },
      orderBy: { createdAt: "desc" },
    });
  }

  async listByMealLog(mealLogId: string, patientUserId: string) {
    return prisma.voiceNote.findMany({
      where: { mealLogId, patientUserId },
      orderBy: { createdAt: "desc" },
    });
  }

  async delete(id: string, patientUserId: string) {
    const note = await prisma.voiceNote.findFirst({
      where: { id, patientUserId },
    });

    if (!note) return false;

    await prisma.voiceNote.delete({ where: { id } });
    return true;
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600) {
    return storage.getSignedReadUrl(key, expiresInSeconds);
  }
}