"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const response_1 = require("../../shared/utils/response");
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return (0, response_1.fail)(res, "Validation error", 422, result.error.issues);
    }
    req.body = result.data;
    return next();
};
exports.validateBody = validateBody;
//# sourceMappingURL=validate.js.map