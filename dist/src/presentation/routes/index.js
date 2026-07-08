"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const patientRoutes_1 = __importDefault(require("./patientRoutes"));
const dietPlanRoutes_1 = __importDefault(require("./dietPlanRoutes"));
const voiceRoutes_1 = __importDefault(require("./voiceRoutes"));
const clinicalRecordRoutes_1 = __importDefault(require("./clinicalRecordRoutes"));
const adherenceRoutes_1 = __importDefault(require("./adherenceRoutes"));
const medicationRoutes_1 = __importDefault(require("./medicationRoutes"));
const progressRoutes_1 = __importDefault(require("./progressRoutes"));
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const router = (0, express_1.Router)();
router.use("/auth", authRoutes_1.default);
router.use("/patients", patientRoutes_1.default);
router.use("/meal-plans", dietPlanRoutes_1.default);
router.use("/voice-notes", voiceRoutes_1.default);
router.use("/clinical-records", clinicalRecordRoutes_1.default);
router.use("/adherence", adherenceRoutes_1.default);
router.use("/medications", medicationRoutes_1.default);
router.use("/progress", progressRoutes_1.default);
router.use("/dashboard", dashboardRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map