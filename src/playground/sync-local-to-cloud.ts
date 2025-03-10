// import { PrismaClient } from "@prisma/client";
// import { EnvironmentLoader, isDevelopment } from "@/configs/environment";

// async function syncLocalToCloud() {
//   const envLoader = EnvironmentLoader.getInstance();

//   const localDbUrl = envLoader.getDatabaseUrl("local");
//   const cloudDbUrl = envLoader.getDatabaseUrl("cloud");

//   console.info("Database URLs:");
//   console.info(`Local: ${localDbUrl}`);
//   console.info(`Cloud: ${cloudDbUrl}`);

//   const localDb = new PrismaClient({
//     datasourceUrl: localDbUrl,
//   });

//   const cloudDb = new PrismaClient({
//     datasourceUrl: cloudDbUrl,
//   });

//   try {
//     console.info("Starting database sync...");
//     console.info(
//       `Source: ${isDevelopment ? "Development" : "Production"} environment`
//     );

//     console.info("Fetching data from local database...");
//     const localData = await fetchLocalData(localDb);

//     console.info("Inserting data to cloud database...");
//     await insertCloudData(cloudDb, localData);

//     console.info("Local to cloud sync completed successfully!");
//   } catch (error) {
//     console.error("Error syncing database:", error);
//     throw error;
//   } finally {
//     await localDb.$disconnect();
//     await cloudDb.$disconnect();
//   }
// }

// async function fetchLocalData(localDb: PrismaClient) {
//   return {
//     users: await localDb.user.findMany(),
//     userProfiles: await localDb.userProfile.findMany(),
//     motorcycleBrands: await localDb.motorcycleBrand.findMany(),
//     motorcycleModels: await localDb.motorcycleModel.findMany(),
//     colors: await localDb.color.findMany(),
//     workshops: await localDb.workshop.findMany(),
//     motorcycleServices: await localDb.motorcycleService.findMany(),
//     motorcycleModelYears: await localDb.motorcycleModelYear.findMany(),
//     motorcycleModelYearColors: await localDb.motorcycleModelYearColor.findMany(),
//     userMotorcycles: await localDb.userMotorcycle.findMany(),
//     paymentMethods: await localDb.paymentMethod.findMany(),
//     orders: await localDb.order.findMany(),
//     transactions: await localDb.transaction.findMany(),
//     eTickets: await localDb.eTicket.findMany(),
//   };
// }

// async function insertCloudData(cloudDb: PrismaClient, data: any) {
//   try {
//     // Level 1: Independent tables
//     console.info("Inserting users...");
//     await cloudDb.user.createMany({
//       data: data.users,
//       skipDuplicates: true,
//     });

//     console.info("Inserting motorcycle brands...");
//     await cloudDb.motorcycleBrand.createMany({
//       data: data.motorcycleBrands,
//       skipDuplicates: true,
//     });

//     console.info("Inserting colors...");
//     await cloudDb.color.createMany({
//       data: data.colors,
//       skipDuplicates: true,
//     });

//     console.info("Inserting workshops...");
//     await cloudDb.workshop.createMany({
//       data: data.workshops,
//       skipDuplicates: true,
//     });

//     console.info("Inserting payment methods...");
//     await cloudDb.paymentMethod.createMany({
//       data: data.paymentMethods,
//       skipDuplicates: true,
//     });

//     // Level 2: Tables with single foreign key dependencies
//     // console.info("Inserting user profiles...");
//     // await cloudDb.userProfile.createMany({
//     //   data: data.userProfiles,
//     //   skipDuplicates: true,
//     // });

//     console.info("Inserting motorcycle models...");
//     await cloudDb.motorcycleModel.createMany({
//       data: data.motorcycleModels,
//       skipDuplicates: true,
//     });

//     console.info("Inserting motorcycle services...");
//     await cloudDb.motorcycleService.createMany({
//       data: data.motorcycleServices,
//       skipDuplicates: true,
//     });

//     // Level 3: Tables with multiple foreign key dependencies
//     console.info("Inserting motorcycle model years...");
//     await cloudDb.motorcycleModelYear.createMany({
//       data: data.motorcycleModelYears,
//       skipDuplicates: true,
//     });

//     console.info("Inserting motorcycle model year colors...");
//     await cloudDb.motorcycleModelYearColor.createMany({
//       data: data.motorcycleModelYearColors,
//       skipDuplicates: true,
//     });

//     // console.info("Inserting user motorcycles...");
//     // await cloudDb.userMotorcycle.createMany({
//     //   data: data.userMotorcycles,
//     //   skipDuplicates: true,
//     // });

//     // // Level 4: Order related tables
//     // console.info("Inserting orders...");
//     // await cloudDb.order.createMany({
//     //   data: data.orders,
//     //   skipDuplicates: true,
//     // });

//     // console.info("Inserting transactions...");
//     // await cloudDb.transaction.createMany({
//     //   data: data.transactions,
//     //   skipDuplicates: true,
//     // });

//     // console.info("Inserting e-tickets...");
//     // await cloudDb.eTicket.createMany({
//     //   data: data.eTickets,
//     //   skipDuplicates: true,
//     // });
//   } catch (error) {
//     console.error("Error during data insertion:", error);
//     throw error;
//   }
// }

// // Run the sync
// syncLocalToCloud();
