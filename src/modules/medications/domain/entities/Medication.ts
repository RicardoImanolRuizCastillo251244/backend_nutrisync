export interface MedicationEntity {
  id: string;
  patientUserId: string;
  name: string;
  dosage: string;
  reminderEnabled: boolean;
  times: string[];
  days: string[];
  intervalHours: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationTakeEntity {
  id: string;
  medicationId: string;
  takenAt: Date;
}