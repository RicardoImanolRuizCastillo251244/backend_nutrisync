"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClinicalRecordUseCase = void 0;
class CreateClinicalRecordUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        return this.repository.create(input);
    }
}
exports.CreateClinicalRecordUseCase = CreateClinicalRecordUseCase;
//# sourceMappingURL=CreateClinicalRecordUseCase.js.map