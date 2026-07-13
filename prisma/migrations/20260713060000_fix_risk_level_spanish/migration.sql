-- Convert old English risk level values to Spanish
UPDATE "ClinicalRecord"
SET "riskLevel" = CASE
  WHEN "riskLevel" = 'underweight' THEN 'Moderado'
  WHEN "riskLevel" = 'normal' THEN 'Normal'
  WHEN "riskLevel" = 'overweight' THEN 'Moderado'
  WHEN "riskLevel" = 'obese' THEN 'Alto'
  ELSE "riskLevel"
END
WHERE "riskLevel" IN ('underweight', 'normal', 'overweight', 'obese');

-- Convert old English BMI classification values to Spanish  
UPDATE "ClinicalRecord"
SET "bmiClassification" = CASE
  WHEN "bmiClassification" = 'underweight' THEN 'Bajo peso'
  WHEN "bmiClassification" = 'normal' THEN 'Normal'
  WHEN "bmiClassification" = 'overweight' THEN 'Sobrepeso'
  WHEN "bmiClassification" = 'obese' THEN 'Obesidad grado I'
  ELSE "bmiClassification"
END
WHERE "bmiClassification" IN ('underweight', 'normal', 'overweight', 'obese');