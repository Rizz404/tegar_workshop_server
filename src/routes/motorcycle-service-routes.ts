import {
  createMotorcycleService,
  createManyMotorcycleServices,
  deleteAllMotorcycleService,
  deleteMotorcycleService,
  getMotorcycleServiceById,
  getMotorcycleServices,
  searchMotorcycleServices,
  updateMotorcycleService,
} from "@/controller/motorcycle-service-controller";
import { authMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validate-request";
import validateRole from "@/middlewares/validate-role";
import {
  createMotorcycleServiceSchema,
  createManyMotorcycleServiceSchema,
  updateMotorcycleServiceSchema,
} from "@/validation/motorcycle-service-validation";
import express from "express";

const motorcycleServiceRouter = express.Router();

motorcycleServiceRouter
  .route("/")
  .get(getMotorcycleServices)
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(createMotorcycleServiceSchema),
    createMotorcycleService
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteAllMotorcycleService
  );

motorcycleServiceRouter
  .route("/multiple")
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(createManyMotorcycleServiceSchema),
    createManyMotorcycleServices
  );

motorcycleServiceRouter.route("/search").get(searchMotorcycleServices);
motorcycleServiceRouter
  .route("/:motorcycleServiceId")
  .get(getMotorcycleServiceById)
  .patch(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(updateMotorcycleServiceSchema),
    updateMotorcycleService
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteMotorcycleService
  );

export default motorcycleServiceRouter;
