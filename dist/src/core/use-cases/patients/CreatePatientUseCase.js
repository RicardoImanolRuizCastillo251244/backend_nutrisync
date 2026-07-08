"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatientUseCase = void 0;
const hash_1 = require("../../../shared/utils/hash");
class CreatePatientUseCase {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async execute(input) {
        const passwordHash = await (0, hash_1.hashPassword)(input.password);
        const payload = {
            nutritionistUserId: input.nutritionistUserId,
            email: input.email,
            passwordHash,
            name: input.name,
            ...(input.phone ? { phone: input.phone } : {}),
            ...(input.birthDate ? { birthDate: new Date(input.birthDate) } : {}),
            ...(input.gender ? { gender: input.gender } : {}),
        };
        return this.patientRepository.create(payload);
    }
}
exports.CreatePatientUseCase = CreatePatientUseCase;
//# sourceMappingURL=CreatePatientUseCase.js.map