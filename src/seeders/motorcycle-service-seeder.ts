import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

const generateMotorcycleServicePrice = (): Prisma.Decimal => {
  const priceRanges = [
    { min: 50_000, max: 500_000 },
    { min: 500_000, max: 2_000_000 },
    { min: 2_000_000, max: 5_000_000 },
  ];

  // * Pilih random berdasarkan array
  const range = faker.helpers.arrayElement(priceRanges);

  const rawPrice = faker.number.float({
    min: range.min,
    max: range.max,
  });

  const roundedPrice = Math.round(rawPrice / 1000) * 1000;

  return new Prisma.Decimal(roundedPrice);
};

const generateMotorcycleService =
  (): Prisma.MotorcycleServiceCreateManyInput => ({
    name: faker.word.noun().slice(0, 50),
    price: generateMotorcycleServicePrice(),
  });

export const seedMotorcycleServices = async (
  prisma: PrismaClient,
  count = 25,
  deleteFirst = true
) => {
  console.log("🌱 Seeding MotorcycleServices...");

  if (deleteFirst) {
    await prisma.motorcycleService.deleteMany();
  }

  const data = Array.from({ length: count }, () => generateMotorcycleService());

  const result = await prisma.motorcycleService.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${result.count} MotorcycleServices`);
};
