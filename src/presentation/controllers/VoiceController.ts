import type { Request, Response } from "express";
import { prisma } from "../../infrastructure/database/prisma";
import { SupabaseStorageService } from "../../infrastructure/storage/SupabaseStorageService";
import { ok } from "../../shared/utils/response";

const storage = new SupabaseStorageService();

export class VoiceController {
  static async upload(req: Request, res: Response) {
    if (!req.file) {
      throw new Error("Voice file is required");
    }

    const patientUserId = req.user!.userId;
    const { mealLogId, durationSec } = req.body as { mealLogId: string; durationSec?: number };

    const key = `voice-notes/${patientUserId}/${crypto.randomUUID()}-${req.file.originalname}`;
    const uploaded = await storage.upload({
      key,
      contentType: req.file.mimetype,
      body: req.file.buffer,
    });

    const note = await prisma.voiceNote.create({
      data: {
        patientUserId,
        mealLogId,
        storageKey: uploaded.key,
        publicUrl: uploaded.url,
        durationSec: durationSec ? Number(durationSec) : null,
      },
    });

    return ok(res, note, 201);
  }
}