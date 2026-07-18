"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePatientOwnership = void 0;
const response_1 = require("@/shared/utils/response");
const requirePatientOwnership = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return (0, response_1.fail)(res, "Authentication required", 401);
    }
    // Nutritionists cannot access patient-only resources (medication, etc.)
    if (user.role === "nutritionist") {
        return (0, response_1.fail)(res, "Nutritionists cannot access patient-specific resources", 403);
    }
    // Patient must be accessing their own data
    const requestedPatientId = req.params.patientId;
    if (requestedPatientId && user.patientId && requestedPatientId !== user.patientId) {
        return (0, response_1.fail)(res, "You can only access your own patient data", 403);
    }
    return next();
};
exports.requirePatientOwnership = requirePatientOwnership;
//# sourceMappingURL=requirePatientOwnership.js.map