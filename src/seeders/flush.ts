import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function flushDatabase() {
  try {
    // Delete in order based on dependencies to avoid foreign key constraint errors
    console.log("🗑️ Starting database flush...");

    // Delete authentication and user related data
    await prisma.eTicket.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.order.deleteMany();
    await prisma.userMotorcycle.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.user.deleteMany();

    // Delete motorcycle related data
    await prisma.motorcycleModelYear.deleteMany();
    await prisma.motorcycleModel.deleteMany();
    await prisma.motorcycleBrand.deleteMany();

    // Delete service related data
    await prisma.motorcycleService.deleteMany();
    await prisma.workshop.deleteMany();
    await prisma.paymentMethod.deleteMany();

    console.log("✅ Database successfully flushed!");
  } catch (error) {
    console.error("❌ Error flushing database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

flushDatabase();
