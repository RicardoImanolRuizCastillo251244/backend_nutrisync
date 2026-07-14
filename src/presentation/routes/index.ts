import { Router } from "express";
import authRoutes from "@/modules/auth/infrastructure/controllers/authRoutes";
import patientRoutes from "@/modules/patients/infrastructure/controllers/patientRoutes";
import dietPlanRoutes from "@/modules/diet-plans/infrastructure/controllers/dietPlanRoutes";
import voiceRoutes from "@/modules/voice-notes/infrastructure/controllers/voiceRoutes";
import clinicalRecordRoutes from "@/modules/clinical-records/infrastructure/controllers/clinicalRecordRoutes";
import adherenceRoutes from "@/modules/adherence/infrastructure/controllers/adherenceRoutes";
import medicationRoutes from "@/modules/medications/infrastructure/controllers/medicationRoutes";
import progressRoutes from "@/modules/progress/infrastructure/controllers/progressRoutes";
import dashboardRoutes from "@/modules/dashboard/infrastructure/controllers/dashboardRoutes";

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