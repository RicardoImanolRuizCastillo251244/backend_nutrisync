"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/infrastructure/database/prisma");
const hash_1 = require("../src/shared/utils/hash");
async function main() {
    const nutritionistEmail = "nutritionist@nutrisync.com";
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: nutritionistEmail } });
    if (existing)
        return;
    const passwordHash = await (0, hash_1.hashPassword)("NutriSync123!");
    await prisma_1.prisma.user.create({
        data: {
            email: nutritionistEmail,
            passwordHash,
            role: "nutritionist",
            name: "Nutriologo Demo",
        },
    });
}
main()
    .then(async () => {
    await prisma_1.prisma.$disconnect();
})
    .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma_1.prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map