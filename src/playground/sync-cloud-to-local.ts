// import { PrismaClient } from "@prisma/client";
// import { EnvironmentLoader, isDevelopment } from "@/configs/environment";

// async function syncCloudToLocal() {
//   const envLoader = EnvironmentLoader.getInstance();

//   const localDbUrl = envLoader.getDatabaseUrl("local");
//   const cloudDbUrl = envLoader.getDatabaseUrl("cloud");

//   console.info("Database URLs:");
//   console.info(`Cloud: ${cloudDbUrl}`);
//   console.info(`Local: ${localDbUrl}`);

//   const cloudDb = new PrismaClient({
//     datasourceUrl: cloudDbUrl,
//   });

//   const localDb = new PrismaClient({
//     datasourceUrl: localDbUrl,
//   });

//   try {
//     console.info("Starting database sync...");
//     console.info(
//       `Source: ${isDevelopment ? "Development" : "Production"} environment`
//     );

//     console.info("Fetching data from cloud database...");
//     const cloudData = await fetchCloudData(cloudDb);

//     console.info("Inserting data to local database...");
//     await insertLocalData(localDb, cloudData);

//     console.info("Cloud to local sync completed successfully!");
//   } catch (error) {
//     console.error("Error syncing database:", error);
//     throw error;
//   } finally {
//     await cloudDb.$disconnect();
//     await localDb.$disconnect();
//   }
// }

// async function fetchCloudData(cloudDb: PrismaClient) {
//   return {
//     users: await cloudDb.user.findMany(),
//     userProfiles: await cloudDb.userProfile.findMany(),
//     motorcycleBrands: await cloudDb.motorcycleBrand.findMany(),
//     motorcycleModels: await cloudDb.motorcycleModel.findMany(),
//     colors: await cloudDb.color.findMany(),
//     workshops: await cloudDb.workshop.findMany(),
//     motorcycleServices: await cloudDb.motorcycleService.findMany(),
//     motorcycleModelYears: await cloudDb.motorcycleModelYear.findMany(),
//     motorcycleModelYearColors: await cloudDb.motorcycleModelYearColor.findMany(),
//     userMotorcycles: await cloudDb.userMotorcycle.findMany(),
//     paymentMethods: await cloudDb.paymentMethod.findMany(),
//     orders: await cloudDb.order.findMany(),
//     transactions: await cloudDb.transaction.findMany(),
//     eTickets: await cloudDb.eTicket.findMany(),
//   };
// }

// async function insertLocalData(localDb: PrismaClient, data: any) {
//   try {
//     // Level 1: Independent tables
//     console.info("Inserting users...");
//     await localDb.user.createMany({
//       data: data.users,
//       skipDuplicates: true,
//     });

//     console.info("Inserting motorcycle brands...");
//     await localDb.motorcycleBrand.createMany({
//       data: data.motorcycleBrands,
//       skipDuplicates: true,
//     });

//     console.info("Inserting colors...");
//     await localDb.color.createMany({
//       data: data.colors,
//       skipDuplicates: true,
//     });

//     console.info("Inserting workshops...");
//     await localDb.workshop.createMany({
//       data: data.workshops,
//       skipDuplicates: true,
//     });

//     console.info("Inserting payment methods...");
//     await localDb.paymentMethod.createMany({
//       data: data.paymentMethods,
//       skipDuplicates: true,
//     });

//     // Level 2: Tables with single foreign key dependencies
//     // console.info("Inserting user profiles...");
//     // await localDb.userProfile.createMany({
//     //   data: data.userProfiles,
//     //   skipDuplicates: true,
//     // });

//     console.info("Inserting motorcycle models...");
//     await localDb.motorcycleModel.createMany({
//       data: data.motorcycleModels,
//       skipDuplicates: true,
//     });

//     console.info("Inserting motorcycle services...");
//     await localDb.motorcycleService.createMany({
//       data: data.motorcycleServices,
//       skipDuplicates: true,
//     });

//     // Level 3: Tables with multiple foreign key dependencies
//     console.info("Inserting motorcycle model years...");
//     await localDb.motorcycleModelYear.createMany({
//       data: data.motorcycleModelYears,
//       skipDuplicates: true,
//     });

//     console.info("Inserting motorcycle model year colors...");
//     await localDb.motorcycleModelYearColor.createMany({
//       data: data.motorcycleModelYearColors,
//       skipDuplicates: true,
//     });

//     // console.info("Inserting user motorcycles...");
//     // await localDb.userMotorcycle.createMany({
//     //   data: data.userMotorcycles,
//     //   skipDuplicates: true,
//     // });

//     // Level 4: Order related tables
//     // console.info("Inserting orders...");
//     // await localDb.order.createMany({
//     //   data: data.orders,
//     //   skipDuplicates: true,
//     // });

//     // console.info("Inserting transactions...");
//     // await localDb.transaction.createMany({
//     //   data: data.transactions,
//     //   skipDuplicates: true,
//     // });

//     // console.info("Inserting e-tickets...");
//     // await localDb.eTicket.createMany({
//     //   data: data.eTickets,
//     //   skipDuplicates: true,
//     // });
//   } catch (error) {
//     console.error("Error during data insertion:", error);
//     throw error;
//   }
// }

// // Run the sync
// syncCloudToLocal();
