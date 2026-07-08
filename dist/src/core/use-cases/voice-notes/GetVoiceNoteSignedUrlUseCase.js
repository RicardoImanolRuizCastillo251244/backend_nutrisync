"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVoiceNoteSignedUrlUseCase = void 0;
class GetVoiceNoteSignedUrlUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        return this.repository.getSignedUrl(input.key, input.expiresInSeconds);
    }
}
exports.GetVoiceNoteSignedUrlUseCase = GetVoiceNoteSignedUrlUseCase;
//# sourceMappingURL=GetVoiceNoteSignedUrlUseCase.js.map