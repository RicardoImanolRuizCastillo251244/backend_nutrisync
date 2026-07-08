"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceNoteQuerySchema = void 0;
const zod_1 = require("zod");
exports.voiceNoteQuerySchema = zod_1.z.object({
    expiresInSeconds: zod_1.z.number().int().positive().optional(),
});
//# sourceMappingURL=voiceNoteValidators.js.map