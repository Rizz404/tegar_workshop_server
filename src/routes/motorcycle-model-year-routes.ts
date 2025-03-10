import {
  createMotorcycleModelYear,
  createManyMotorcycleModelYears,
  deleteAllMotorcycleModelYear,
  deleteMotorcycleModelYear,
  getMotorcycleModelYearById,
  getMotorcycleModelYears,
  getMotorcycleModelYearsByMotorcycleModelId,
  searchMotorcycleModelYears,
  updateMotorcycleModelYear,
} from "@/controller/motorcycle-model-year-controller";
import { authMiddleware } from "@/middlewares/auth";
import { uploadSingle } from "@/playground/upload-file";
import { validateRequest } from "@/middlewares/validate-request";
import validateRole from "@/middlewares/validate-role";
import {
  createMotorcycleModelYearSchema,
  createManyMotorcycleModelYearSchema,
  updateMotorcycleModelYearSchema,
} from "@/validation/motorcycle-model-year-validation";
import express from "express";

const motorcycleModelYearRouter = express.Router();

motorcycleModelYearRouter
  .route("/")
  .get(getMotorcycleModelYears)
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(createMotorcycleModelYearSchema),
    createMotorcycleModelYear
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteAllMotorcycleModelYear
  );

motorcycleModelYearRouter
  .route("/motorcycle-model/:motorcycleModelId")
  .get(getMotorcycleModelYearsByMotorcycleModelId);

motorcycleModelYearRouter
  .route("/multiple")
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(createManyMotorcycleModelYearSchema),
    createManyMotorcycleModelYears
  );

motorcycleModelYearRouter.route("/search").get(searchMotorcycleModelYears);
motorcycleModelYearRouter
  .route("/:motorcycleModelYearId")
  .get(getMotorcycleModelYearById)
  .patch(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    validateRequest(updateMotorcycleModelYearSchema),
    updateMotorcycleModelYear
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteMotorcycleModelYear
  );

export default motorcycleModelYearRouter;
