-- Expand ClinicalRecord from legacy JSON payload (data JSONB) to flat columns.
-- This migration is idempotent and preserves existing rows by backfilling data when possible.

ALTER TABLE "ClinicalRecord"
  ADD COLUMN IF NOT EXISTS "name" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "sex" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "age" INTEGER,
  ADD COLUMN IF NOT EXISTS "occupation" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "bloodType" VARCHAR(10),
  ADD COLUMN IF NOT EXISTS "consultationReason" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "phone" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "weightKg" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "heightCm" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "maritalStatus" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "allergies" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "feedingDifficulty" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "address" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "familyObesity" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "familyCancer" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "familyHypertension" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "familyHIV" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "familyDiabetesType1" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "familyDiabetesType2" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "familyOther" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "personalDiarrhea" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "personalColitis" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "personalReflux" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "personalConstipation" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "personalNausea" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "personalGastritis" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "personalVomiting" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "personalOther" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "labGlucose" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "labCholesterol" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "labTriglycerides" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "physicalHair" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "physicalMouth" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "physicalTeeth" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "physicalEyes" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "physicalGums" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "physicalNails" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "bmiClassification" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "visceralFat" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "muscleMass" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "biologicalAge" INTEGER,
  ADD COLUMN IF NOT EXISTS "restingMetabolism" INTEGER,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'ClinicalRecord' AND column_name = 'data'
  ) THEN
    UPDATE "ClinicalRecord"
    SET
      "name" = COALESCE("name", NULLIF("data"->>'name', '')),
      "sex" = COALESCE(
        "sex",
        NULLIF("data"->>'sex', ''),
        CASE
          WHEN lower(COALESCE("data"->>'gender', '')) = 'male' THEN 'Masculino'
          WHEN lower(COALESCE("data"->>'gender', '')) = 'female' THEN 'Femenino'
          WHEN lower(COALESCE("data"->>'gender', '')) = 'other' THEN 'Otro'
          ELSE NULL
        END
      ),
      "age" = COALESCE(
        "age",
        CASE
          WHEN COALESCE("data"->>'age', '') ~ '^-?[0-9]+$' THEN ("data"->>'age')::INTEGER
          ELSE NULL
        END
      ),
      "occupation" = COALESCE("occupation", NULLIF("data"->>'occupation', '')),
      "bloodType" = COALESCE("bloodType", NULLIF("data"->>'bloodType', '')),
      "consultationReason" = COALESCE("consultationReason", NULLIF("data"->>'consultationReason', '')),
      "phone" = COALESCE("phone", NULLIF("data"->>'phone', '')),
      "weightKg" = COALESCE(
        "weightKg",
        CASE
          WHEN COALESCE("data"->>'weightKg', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'weightKg')::DOUBLE PRECISION
          WHEN COALESCE("data"->>'weight', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'weight')::DOUBLE PRECISION
          ELSE NULL
        END
      ),
      "heightCm" = COALESCE(
        "heightCm",
        CASE
          WHEN COALESCE("data"->>'heightCm', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'heightCm')::DOUBLE PRECISION
          WHEN COALESCE("data"->>'height', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'height')::DOUBLE PRECISION
          ELSE NULL
        END
      ),
      "maritalStatus" = COALESCE("maritalStatus", NULLIF("data"->>'maritalStatus', '')),
      "allergies" = COALESCE("allergies", NULLIF("data"->>'allergies', '')),
      "feedingDifficulty" = COALESCE(
        "feedingDifficulty",
        CASE
          WHEN lower(COALESCE("data"->>'feedingDifficulty', '')) IN ('true', 'false')
            THEN ("data"->>'feedingDifficulty')::BOOLEAN
          ELSE false
        END
      ),
      "address" = COALESCE("address", NULLIF("data"->>'address', '')),
      "familyObesity" = COALESCE(
        "familyObesity",
        CASE WHEN lower(COALESCE("data"->>'familyObesity', '')) IN ('true', 'false') THEN ("data"->>'familyObesity')::BOOLEAN ELSE false END
      ),
      "familyCancer" = COALESCE(
        "familyCancer",
        CASE WHEN lower(COALESCE("data"->>'familyCancer', '')) IN ('true', 'false') THEN ("data"->>'familyCancer')::BOOLEAN ELSE false END
      ),
      "familyHypertension" = COALESCE(
        "familyHypertension",
        CASE WHEN lower(COALESCE("data"->>'familyHypertension', '')) IN ('true', 'false') THEN ("data"->>'familyHypertension')::BOOLEAN ELSE false END
      ),
      "familyHIV" = COALESCE(
        "familyHIV",
        CASE WHEN lower(COALESCE("data"->>'familyHIV', '')) IN ('true', 'false') THEN ("data"->>'familyHIV')::BOOLEAN ELSE false END
      ),
      "familyDiabetesType1" = COALESCE(
        "familyDiabetesType1",
        CASE WHEN lower(COALESCE("data"->>'familyDiabetesType1', '')) IN ('true', 'false') THEN ("data"->>'familyDiabetesType1')::BOOLEAN ELSE false END
      ),
      "familyDiabetesType2" = COALESCE(
        "familyDiabetesType2",
        CASE WHEN lower(COALESCE("data"->>'familyDiabetesType2', '')) IN ('true', 'false') THEN ("data"->>'familyDiabetesType2')::BOOLEAN ELSE false END
      ),
      "familyOther" = COALESCE("familyOther", NULLIF("data"->>'familyOther', '')),
      "personalDiarrhea" = COALESCE(
        "personalDiarrhea",
        CASE WHEN lower(COALESCE("data"->>'personalDiarrhea', '')) IN ('true', 'false') THEN ("data"->>'personalDiarrhea')::BOOLEAN ELSE false END
      ),
      "personalColitis" = COALESCE(
        "personalColitis",
        CASE WHEN lower(COALESCE("data"->>'personalColitis', '')) IN ('true', 'false') THEN ("data"->>'personalColitis')::BOOLEAN ELSE false END
      ),
      "personalReflux" = COALESCE(
        "personalReflux",
        CASE WHEN lower(COALESCE("data"->>'personalReflux', '')) IN ('true', 'false') THEN ("data"->>'personalReflux')::BOOLEAN ELSE false END
      ),
      "personalConstipation" = COALESCE(
        "personalConstipation",
        CASE WHEN lower(COALESCE("data"->>'personalConstipation', '')) IN ('true', 'false') THEN ("data"->>'personalConstipation')::BOOLEAN ELSE false END
      ),
      "personalNausea" = COALESCE(
        "personalNausea",
        CASE WHEN lower(COALESCE("data"->>'personalNausea', '')) IN ('true', 'false') THEN ("data"->>'personalNausea')::BOOLEAN ELSE false END
      ),
      "personalGastritis" = COALESCE(
        "personalGastritis",
        CASE WHEN lower(COALESCE("data"->>'personalGastritis', '')) IN ('true', 'false') THEN ("data"->>'personalGastritis')::BOOLEAN ELSE false END
      ),
      "personalVomiting" = COALESCE(
        "personalVomiting",
        CASE WHEN lower(COALESCE("data"->>'personalVomiting', '')) IN ('true', 'false') THEN ("data"->>'personalVomiting')::BOOLEAN ELSE false END
      ),
      "personalOther" = COALESCE("personalOther", NULLIF("data"->>'personalOther', '')),
      "labGlucose" = COALESCE(
        "labGlucose",
        CASE WHEN COALESCE("data"->>'labGlucose', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'labGlucose')::DOUBLE PRECISION ELSE NULL END
      ),
      "labCholesterol" = COALESCE(
        "labCholesterol",
        CASE WHEN COALESCE("data"->>'labCholesterol', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'labCholesterol')::DOUBLE PRECISION ELSE NULL END
      ),
      "labTriglycerides" = COALESCE(
        "labTriglycerides",
        CASE WHEN COALESCE("data"->>'labTriglycerides', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'labTriglycerides')::DOUBLE PRECISION ELSE NULL END
      ),
      "physicalHair" = COALESCE("physicalHair", NULLIF("data"->>'physicalHair', '')),
      "physicalMouth" = COALESCE("physicalMouth", NULLIF("data"->>'physicalMouth', '')),
      "physicalTeeth" = COALESCE("physicalTeeth", NULLIF("data"->>'physicalTeeth', '')),
      "physicalEyes" = COALESCE("physicalEyes", NULLIF("data"->>'physicalEyes', '')),
      "physicalGums" = COALESCE("physicalGums", NULLIF("data"->>'physicalGums', '')),
      "physicalNails" = COALESCE("physicalNails", NULLIF("data"->>'physicalNails', '')),
      "bmi" = COALESCE(
        "bmi",
        CASE WHEN COALESCE("data"->>'bmi', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'bmi')::DOUBLE PRECISION ELSE NULL END
      ),
      "bmiClassification" = COALESCE("bmiClassification", NULLIF("data"->>'bmiClassification', '')),
      "bodyFatPercentage" = COALESCE(
        "bodyFatPercentage",
        CASE WHEN COALESCE("data"->>'bodyFatPercentage', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'bodyFatPercentage')::DOUBLE PRECISION ELSE NULL END
      ),
      "visceralFat" = COALESCE(
        "visceralFat",
        CASE WHEN COALESCE("data"->>'visceralFat', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'visceralFat')::DOUBLE PRECISION ELSE NULL END
      ),
      "muscleMass" = COALESCE(
        "muscleMass",
        CASE WHEN COALESCE("data"->>'muscleMass', '') ~ '^-?[0-9]+(\.[0-9]+)?$' THEN ("data"->>'muscleMass')::DOUBLE PRECISION ELSE NULL END
      ),
      "biologicalAge" = COALESCE(
        "biologicalAge",
        CASE WHEN COALESCE("data"->>'biologicalAge', '') ~ '^-?[0-9]+$' THEN ("data"->>'biologicalAge')::INTEGER ELSE NULL END
      ),
      "restingMetabolism" = COALESCE(
        "restingMetabolism",
        CASE WHEN COALESCE("data"->>'restingMetabolism', '') ~ '^-?[0-9]+$' THEN ("data"->>'restingMetabolism')::INTEGER ELSE NULL END
      ),
      "riskLevel" = COALESCE("riskLevel", NULLIF("data"->>'riskLevel', ''))
    WHERE "data" IS NOT NULL;

    ALTER TABLE "ClinicalRecord" DROP COLUMN IF EXISTS "data";
  END IF;
END $$;
