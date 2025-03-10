import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

const generateMotorcycleModel = (
  motorcycleBrandId: string
): Prisma.MotorcycleModelCreateManyInput => ({
  motorcycleBrandId,
  name: faker.vehicle.model().slice(0, 50),
});

export const seedMotorcycleModels = async (
  prisma: PrismaClient,
  modelsPerBrand = 2,
  deleteFirst = true
) => {
  console.log("🌱 Seeding MotorcycleModels...");
  if (deleteFirst) {
    await prisma.motorcycleModel.deleteMany();
  }
  const motorcycleBrands = await prisma.motorcycleBrand.findMany({
    select: { id: true },
  });
  if (!motorcycleBrands.length) {
    console.warn(
      "⚠️ No MotorcycleBrands found. Skipping MotorcycleModels seeding."
    );
    return;
  }
  let data: Prisma.MotorcycleModelCreateManyInput[] = [];
  for (const brand of motorcycleBrands) {
    for (let i = 0; i < modelsPerBrand; i++) {
      data.push(generateMotorcycleModel(brand.id));
    }
  }
  const result = await prisma.motorcycleModel.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${result.count} MotorcycleModels`);
};
