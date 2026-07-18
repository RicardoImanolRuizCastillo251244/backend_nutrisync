"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaVoiceNoteRepository = void 0;
const prisma_1 = require("../../../../shared/infrastructure/database/prisma");
class PrismaVoiceNoteRepository {
    async create(data) {
        const note = await prisma_1.prisma.voiceNote.create({ data });
        return note;
    }
    async findById(id) {
        const note = await prisma_1.prisma.voiceNote.findUnique({ where: { id } });
        return note;
    }
    async listByPatient(patientUserId) {
        const notes = await prisma_1.prisma.voiceNote.findMany({
            where: { patientUserId },
            orderBy: { createdAt: "desc" },
        });
        return notes;
    }
    async delete(id, patientUserId) {
        await prisma_1.prisma.voiceNote.deleteMany({
            where: { id, patientUserId },
        });
    }
}
exports.PrismaVoiceNoteRepository = PrismaVoiceNoteRepository;
//# sourceMappingURL=PrismaVoiceNoteRepository.js.map