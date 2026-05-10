
import { prisma } from "../lib/db";

async function main() {
  console.log("Safeguarding existing users...");
  
  const result = await prisma.user.updateMany({
    where: {
      emailVerified: null,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  console.log(`Successfully verified ${result.count} legacy users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
