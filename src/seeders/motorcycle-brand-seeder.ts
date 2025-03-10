import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const generateMotorcycleBrand = (): Prisma.MotorcycleBrandCreateManyInput => ({
  name: faker.company.name().slice(0, 50),
  logo: faker.image.urlLoremFlickr({ category: "transport" }),
  country: faker.location.country(),
});

export const seedMotorcycleBrands = async (
  prisma: PrismaClient,
  count = 25,
  deleteFirst = true
) => {
  console.log("🌱 Seeding MotorcycleBrands...");
  if (deleteFirst) {
    await prisma.motorcycleBrand.deleteMany();
  }
  const data = Array.from({ length: count }, generateMotorcycleBrand);
  const result = await prisma.motorcycleBrand.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${result.count} MotorcycleBrands`);
};
