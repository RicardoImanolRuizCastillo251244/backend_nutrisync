import { Router } from "express";
import authRoutes from "./authRoutes";
import patientRoutes from "./patientRoutes";
import dietPlanRoutes from "./dietPlanRoutes";
import voiceRoutes from "./voiceRoutes";
import clinicalRecordRoutes from "./clinicalRecordRoutes";
import adherenceRoutes from "./adherenceRoutes";
import medicationRoutes from "./medicationRoutes";
import progressRoutes from "./progressRoutes";
import dashboardRoutes from "./dashboardRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/meal-plans", dietPlanRoutes);
router.use("/voice-notes", voiceRoutes);
router.use("/clinical-records", clinicalRecordRoutes);
router.use("/adherence", adherenceRoutes);
router.use("/medications", medicationRoutes);
router.use("/progress", progressRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
