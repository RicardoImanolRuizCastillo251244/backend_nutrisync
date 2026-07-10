"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateEmailError = void 0;
/**
 * Error lanzado cuando se intenta registrar un email que ya existe en el sistema.
 */
class DuplicateEmailError extends Error {
    constructor(email) {
        super(`Este correo electrónico ya está registrado`);
        this.name = "DuplicateEmailError";
    }
}
exports.DuplicateEmailError = DuplicateEmailError;
//# sourceMappingURL=DuplicateEmailError.js.map