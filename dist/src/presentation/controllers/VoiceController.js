"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceController = void 0;
const prisma_1 = require("../../infrastructure/database/prisma");
const SupabaseStorageService_1 = require("../../infrastructure/storage/SupabaseStorageService");
const response_1 = require("../../shared/utils/response");
const storage = new SupabaseStorageService_1.SupabaseStorageService();
class VoiceController {
    static async upload(req, res) {
        if (!req.file) {
            throw new Error("Voice file is required");
        }
        const patientUserId = req.user.userId;
        const { mealLogId, durationSec } = req.body;
        const key = `voice-notes/${patientUserId}/${crypto.randomUUID()}-${req.file.originalname}`;
        const uploaded = await storage.upload({
            key,
            contentType: req.file.mimetype,
            body: req.file.buffer,
        });
        const note = await prisma_1.prisma.voiceNote.create({
            data: {
                patientUserId,
                mealLogId,
                storageKey: uploaded.key,
                publicUrl: uploaded.url,
                durationSec: durationSec ? Number(durationSec) : null,
            },
        });
        return (0, response_1.ok)(res, note, 201);
    }
}
exports.VoiceController = VoiceController;
//# sourceMappingURL=VoiceController.js.map