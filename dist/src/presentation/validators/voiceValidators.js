"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVoiceMetaSchema = void 0;
const zod_1 = require("zod");
exports.uploadVoiceMetaSchema = zod_1.z.object({
    mealLogId: zod_1.z.string().uuid(),
    durationSec: zod_1.z.coerce.number().int().positive().optional(),
});
//# sourceMappingURL=voiceValidators.js.map