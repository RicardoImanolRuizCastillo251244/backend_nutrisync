import type { Request, Response } from "express";
import { ListVoiceNotesUseCase } from "@/modules/voice-notes/application/use-cases/ListVoiceNotesUseCase";
import { DeleteVoiceNoteUseCase } from "@/modules/voice-notes/application/use-cases/DeleteVoiceNoteUseCase";
import { PrismaVoiceNoteRepository } from "@/modules/voice-notes/infrastructure/repositories/PrismaVoiceNoteRepository";
import { ok, fail } from "@/shared/utils/response";

const voiceNoteRepository = new PrismaVoiceNoteRepository();
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