/**
 * Error lanzado cuando se intenta registrar un email que ya existe en el sistema.
 */
export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Este correo electrónico ya está registrado`);
    this.name = "DuplicateEmailError";
  }
}