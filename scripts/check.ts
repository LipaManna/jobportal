import { prisma } from "../lib/prisma";

async function main() {
    const employers = await prisma.employer.findMany();
    console.log("Employers:");
    console.dir(employers, { depth: null });
    
    const users = await prisma.user.findMany();
    console.log("Users:");
    console.dir(users, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
