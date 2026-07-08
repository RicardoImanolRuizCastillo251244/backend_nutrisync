export const ROLES = {
  NUTRITIONIST: "nutritionist",
  PATIENT: "patient",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
