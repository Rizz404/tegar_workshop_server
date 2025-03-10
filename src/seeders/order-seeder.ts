import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

const generateOrderTotalPrice = (): Prisma.Decimal => {
  const totalPriceRanges = [{ min: 500_000, max: 12_000_000 }];

  // * Pilih random berdasarkan array
  const range = faker.helpers.arrayElement(totalPriceRanges);

  const rawTotalPrice = faker.number.float({
    min: range.min,
    max: range.max,
  });

  const roundedTotalPrice = Math.round(rawTotalPrice / 1000) * 1000;

  return new Prisma.Decimal(roundedTotalPrice);
};

const generateOrder = (
  userId: string,
  userMotorcycleId: string,
  workshopId: string,
  transactionId: string
): Prisma.OrderCreateManyInput => ({
  userId,
  userMotorcycleId,
  workshopId,
  transactionId,
  workStatus: faker.helpers.arrayElement([
    "QUEUED",
    "INSPECTION",
    "PUTTY",
    "SURFACER",
    "APPLICATION_COLOR_BASE",
    "APPLICATION_CLEAR_COAT",
    "POLISHING",
    "FINAL_QC",
    "COMPLETED",
  ]) as Prisma.OrderCreateInput["workStatus"],
  orderStatus: "DRAFT",
  note: faker.lorem.sentence(),
  subtotalPrice: generateOrderTotalPrice(),
});

export const seedOrders = async (
  prisma: PrismaClient,
  count = 25,
  deleteFirst = true
) => {
  console.log("🌱 Seeding Orders...");
  if (deleteFirst) {
    await prisma.order.deleteMany();
  }
  const users = await prisma.user.findMany({ select: { id: true } });
  const userMotorcycles = await prisma.userMotorcycle.findMany({
    select: { id: true },
  });
  const workshops = await prisma.workshop.findMany({ select: { id: true } });
  const transactions = await prisma.transaction.findMany({
    select: { id: true },
  });

  if (
    !users.length ||
    !userMotorcycles.length ||
    !workshops.length ||
    !transactions.length
  ) {
    console.warn("⚠️ Missing dependencies for Orders. Skipping seeding.");
    return;
  }

  const data: Prisma.OrderCreateManyInput[] = [];
  for (let i = 0; i < count; i++) {
    data.push(
      generateOrder(
        users[Math.floor(Math.random() * users.length)].id,
        userMotorcycles[Math.floor(Math.random() * userMotorcycles.length)].id,
        workshops[Math.floor(Math.random() * workshops.length)].id,
        transactions[Math.floor(Math.random() * transactions.length)].id
      )
    );
  }
  const result = await prisma.order.createMany({ data, skipDuplicates: true });
  console.log(`✅ Seeded ${result.count} Orders`);
};
