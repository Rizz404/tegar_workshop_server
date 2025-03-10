import { PrismaClient } from "@prisma/client";
import { seedWorkshops } from "./workshop-seeder";
import { seedCarBrands } from "./car-brand-seeder";
import { seedUsersWithProfiles } from "./user-seeder";
import { seedCarModels } from "./car-model-seeder";
import { seedCarServices } from "./car-service-seeder";
import { seedCarModelYears } from "./car-model-year-seeder";
import { seedUserCars } from "./user-car-seeder";
import { seedPaymentMethods } from "./payment-method-seeder";
import { seedOrders } from "./order-seeder";
import { seedTransactions } from "./transaction-seeder";
import { seedETickets } from "./e-ticket-seeder";
import { seedColors } from "./color-seeder";
import { seedCarModelYearColors } from "./car-model-year-color-seeder";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    await seedUsersWithProfiles(prisma, undefined, false);
    await seedCarBrands(prisma, undefined, false);
    await seedCarModels(prisma, undefined, false);
    await seedWorkshops(prisma, undefined, false);
    await seedCarServices(prisma, undefined, false);
    await seedColors(prisma, undefined, false);
    await seedCarModelYears(prisma, undefined, false);
    await seedCarModelYearColors(prisma, undefined, false);
    await seedUserCars(prisma, undefined, false);
    await seedPaymentMethods(prisma, false);
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
