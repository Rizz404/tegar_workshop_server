import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

const generateUserMotorcycle = (
  userId: string,
  motorcycleModelYearId: string
): Prisma.UserMotorcycleCreateManyInput => ({
  userId,
  motorcycleModelYearId,
  licensePlate: faker.vehicle.vrm(),
  motorcycleImages: [faker.image.urlLoremFlickr({ category: "transport" })],
});

export const seedUserMotorcycles = async (
  prisma: PrismaClient,
  count = 25,
  deleteFirst = true
) => {
  console.log("🌱 Seeding UserMotorcycles...");
  if (deleteFirst) {
    await prisma.userMotorcycle.deleteMany();
  }
  const users = await prisma.user.findMany({ select: { id: true } });
  const motorcycleModelYears = await prisma.motorcycleModelYear.findMany({
    select: { id: true },
  });

  if (!users.length || !motorcycleModelYears.length) {
    console.warn(
      "⚠️ Missing dependencies for UserMotorcycles. Skipping seeding."
    );
    return;
  }

  const data: Prisma.UserMotorcycleCreateManyInput[] = [];
  for (let i = 0; i < count; i++) {
    data.push(
      generateUserMotorcycle(
        users[Math.floor(Math.random() * users.length)].id,
        motorcycleModelYears[
          Math.floor(Math.random() * motorcycleModelYears.length)
        ].id
      )
    );
  }
  const result = await prisma.userMotorcycle.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${result.count} UserMotorcycles`);
};
