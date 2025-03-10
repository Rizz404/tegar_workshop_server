import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

const generateMotorcycleModelYear = (
  motorcycleModelId: string
): Prisma.MotorcycleModelYearCreateManyInput => ({
  motorcycleModelId,
  year: faker.number.int({ min: 1990, max: new Date().getFullYear() }),
});

export const seedMotorcycleModelYears = async (
  prisma: PrismaClient,
  yearsPerModel = 2,
  deleteFirst = true
) => {
  console.log("🌱 Seeding MotorcycleModelYears...");
  if (deleteFirst) {
    await prisma.motorcycleModelYear.deleteMany();
  }
  const motorcycleModels = await prisma.motorcycleModel.findMany({
    select: { id: true },
  });
  if (!motorcycleModels.length) {
    console.warn(
      "⚠️ No MotorcycleModels found. Skipping MotorcycleModelYears seeding."
    );
    return;
  }
  let data: Prisma.MotorcycleModelYearCreateManyInput[] = [];
  for (const model of motorcycleModels) {
    for (let i = 0; i < yearsPerModel; i++) {
      data.push(generateMotorcycleModelYear(model.id));
    }
  }
  const result = await prisma.motorcycleModelYear.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${result.count} MotorcycleModelYears`);
};
