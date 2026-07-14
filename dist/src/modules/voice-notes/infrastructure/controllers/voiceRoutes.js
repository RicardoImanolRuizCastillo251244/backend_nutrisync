"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VoiceController_1 = require("../../../../modules/voice-notes/infrastructure/controllers/VoiceController");
const authMiddleware_1 = require("../../../../presentation/middlewares/authMiddleware");
const requireRole_1 = require("../../../../presentation/middlewares/requireRole");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.get("/", (0, requireRole_1.requireRole)("patient"), VoiceController_1.VoiceController.list);
router.delete("/:id", (0, requireRole_1.requireRole)("patient"), VoiceController_1.VoiceController.remove);
exports.default = router;
//# sourceMappingURL=voiceRoutes.js.map