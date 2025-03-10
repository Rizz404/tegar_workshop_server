import {
  createMotorcycleModel,
  createManyMotorcycleModels,
  deleteAllMotorcycleModel,
  deleteMotorcycleModel,
  getMotorcycleModelById,
  getMotorcycleModels,
  getMotorcycleModelsByBrandId,
  searchMotorcycleModels,
  updateMotorcycleModel,
} from "@/controller/motorcycle-model-controller";
import { authMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validate-request";
import validateRole from "@/middlewares/validate-role";
import {
  createMotorcycleModelSchema,
  createManyMotorcycleModelSchema,
  updateMotorcycleModelSchema,
} from "@/validation/motorcycle-model-validation";
import express from "express";

const motorcycleModelRouter = express.Router();

motorcycleModelRouter
  .route("/")
  .get(getMotorcycleModels)
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(createMotorcycleModelSchema),
    createMotorcycleModel
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteAllMotorcycleModel
  );

motorcycleModelRouter
  .route("/motorcycle-brand/:motorcycleBrandId")
  .get(getMotorcycleModelsByBrandId);

motorcycleModelRouter
  .route("/multiple")
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(createManyMotorcycleModelSchema),
    createManyMotorcycleModels
  );

motorcycleModelRouter.route("/search").get(searchMotorcycleModels);

motorcycleModelRouter
  .route("/:motorcycleModelId")
  .get(getMotorcycleModelById)
  .patch(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(updateMotorcycleModelSchema),
    updateMotorcycleModel
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteMotorcycleModel
  );

export default motorcycleModelRouter;
