"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const VoiceController_1 = require("../../../../modules/voice-notes/infrastructure/controllers/VoiceController");
const authMiddleware_1 = require("../../../../presentation/middlewares/authMiddleware");
const requireRole_1 = require("../../../../presentation/middlewares/requireRole");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.post("/upload", (0, requireRole_1.requireRole)("patient"), upload.single("voice"), VoiceController_1.VoiceController.upload);
router.get("/", (0, requireRole_1.requireRole)("patient"), VoiceController_1.VoiceController.list);
router.delete("/:id", (0, requireRole_1.requireRole)("patient"), VoiceController_1.VoiceController.remove);
exports.default = router;
//# sourceMappingURL=voiceRoutes.js.map