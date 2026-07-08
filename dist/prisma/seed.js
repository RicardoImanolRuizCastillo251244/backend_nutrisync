"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/infrastructure/database/prisma");
const hash_1 = require("../src/shared/utils/hash");
const nutritionists = [
    { email: "admin@gmail.com", password: "admin251243", name: "Admin NutriSync" },
    { email: "nutriologo@nutrisync.com", password: "nutrisync251243", name: "Nutriólogo Principal" },
];
async function main() {
    for (const n of nutritionists) {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: n.email } });
        if (existing) {
            console.log(`Skipping ${n.email}: already exists`);
            continue;
        }
        const passwordHash = await (0, hash_1.hashPassword)(n.password);
        await prisma_1.prisma.user.create({
            data: {
                email: n.email,
                passwordHash,
                role: "nutritionist",
                name: n.name,
            },
        });
        console.log(`Created: ${n.email}`);
    }
}
main()
    .then(async () => {
    await prisma_1.prisma.$disconnect();
    console.log("Seed completed.");
})
    .catch(async (e) => {
    console.error(e);
    await prisma_1.prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map