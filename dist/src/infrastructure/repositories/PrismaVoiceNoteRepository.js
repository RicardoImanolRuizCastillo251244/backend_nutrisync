"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaVoiceNoteRepository = void 0;
const prisma_1 = require("../database/prisma");
const SupabaseStorageService_1 = require("../storage/SupabaseStorageService");
const storage = new SupabaseStorageService_1.SupabaseStorageService();
class PrismaVoiceNoteRepository {
    async listByPatient(patientUserId) {
        return prisma_1.prisma.voiceNote.findMany({
            where: { patientUserId },
            orderBy: { createdAt: "desc" },
        });
    }
    async listByMealLog(mealLogId, patientUserId) {
        return prisma_1.prisma.voiceNote.findMany({
            where: { mealLogId, patientUserId },
            orderBy: { createdAt: "desc" },
        });
    }
    async delete(id, patientUserId) {
        const note = await prisma_1.prisma.voiceNote.findFirst({
            where: { id, patientUserId },
        });
        if (!note)
            return false;
        await prisma_1.prisma.voiceNote.delete({ where: { id } });
        return true;
    }
    async getSignedUrl(key, expiresInSeconds = 3600) {
        return storage.getSignedReadUrl(key, expiresInSeconds);
    }
}
exports.PrismaVoiceNoteRepository = PrismaVoiceNoteRepository;
//# sourceMappingURL=PrismaVoiceNoteRepository.js.map