import { PrismaClient } from "@prisma/client";
import { seedWorkshops } from "./workshop-seeder";
import { seedMotorcycleBrands } from "./motorcycle-brand-seeder";
import { seedUsersWithProfiles } from "./user-seeder";
import { seedMotorcycleModels } from "./motorcycle-model-seeder";
import { seedMotorcycleServices } from "./motorcycle-service-seeder";
import { seedMotorcycleModelYears } from "./motorcycle-model-year-seeder";
import { seedUserMotorcycles } from "./user-motorcycle-seeder";
import { seedPaymentMethods } from "./payment-method-seeder";
import { seedOrders } from "./order-seeder";
import { seedTransactions } from "./transaction-seeder";
import { seedETickets } from "./e-ticket-seeder";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    await seedUsersWithProfiles(prisma, undefined, false);
    await seedMotorcycleBrands(prisma, undefined, false);
    await seedMotorcycleModels(prisma, undefined, false);
    await seedWorkshops(prisma, undefined, false);
    await seedMotorcycleServices(prisma, undefined, false);
    await seedMotorcycleModelYears(prisma, undefined, false);
    await seedUserMotorcycles(prisma, undefined, false);
    // await seedPaymentMethods(prisma, false);
    // await seedTransactions(prisma, undefined, false);
    // await seedOrders(prisma, undefined, false);
    // await seedETickets(prisma, undefined, false);

    console.log("✅ Database seeding completed");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
