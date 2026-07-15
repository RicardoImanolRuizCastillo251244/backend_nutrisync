import type { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { ListVoiceNotesUseCase } from "@/modules/voice-notes/application/use-cases/ListVoiceNotesUseCase";
import { DeleteVoiceNoteUseCase } from "@/modules/voice-notes/application/use-cases/DeleteVoiceNoteUseCase";
import { PrismaVoiceNoteRepository } from "@/modules/voice-notes/infrastructure/repositories/PrismaVoiceNoteRepository";
import { SupabaseStorageService } from "@/infrastructure/storage/SupabaseStorageService";
import { ok, fail } from "@/shared/utils/response";

const voiceNoteRepository = new PrismaVoiceNoteRepository();
const storageService = new SupabaseStorageService();
const listUseCase = new ListVoiceNotesUseCase(voiceNoteRepository);
const deleteUseCase = new DeleteVoiceNoteUseCase(voiceNoteRepository);

export class VoiceController {
  static async list(req: Request, res: Response) {
    try {
      const notes = await listUseCase.execute(req.user!.userId);
      return ok(res, notes);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al listar notas de voz";
      return fail(res, message, 500);
    }
  }

  static async upload(req: any, res: Response) {
    try {
      if (!req.file) return fail(res, "No se envió archivo de voz", 400);

      const mealLogId = (req.body.mealLogId as string) || "";

      // Subir a Supabase
      const { key, url } = await storageService.upload({
        key: `voice-notes/${uuid()}.m4a`,
        body: req.file.buffer,
        contentType: (req.file as any).mimetype || "audio/mp4",
      });

      // Guardar referencia en BD
      const note = await voiceNoteRepository.create({
        patientUserId: req.user!.userId,
        mealLogId,
        storageKey: key,
        publicUrl: url,
      });

      return ok(res, note, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al subir nota de voz";
      return fail(res, message, 500);
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      await deleteUseCase.execute({ id, patientUserId: req.user!.userId });
      return ok(res, { message: "Voice note deleted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al eliminar nota de voz";
      return fail(res, message, 500);
    }
  }
}