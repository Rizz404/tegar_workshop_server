import express from "express";
import { authMiddleware } from "@/middlewares/auth";
import {
  createMotorcycleBrandSchema,
  createManyMotorcycleBrandSchema,
  updateMotorcycleBrandSchema,
} from "@/validation/motorcycle-brand-validation";
import {
  createMotorcycleBrand,
  createManyMotorcycleBrands,
  deleteAllMotorcycleBrand,
  deleteMotorcycleBrand,
  getMotorcycleBrandById,
  getMotorcycleBrands,
  searchMotorcycleBrands,
  updateMotorcycleBrand,
} from "@/controller/motorcycle-brand-controller";
import validateRole from "@/middlewares/validate-role";
import { validateRequest } from "@/middlewares/validate-request";
import { uploadFilesToCloudinary, parseFiles } from "@/middlewares/upload-file";

const motorcycleBrandRouter = express.Router();

motorcycleBrandRouter
  .route("/")
  .get(getMotorcycleBrands)
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    parseFiles.single("logo"),
    validateRequest(createMotorcycleBrandSchema),
    uploadFilesToCloudinary("motorcycle-brand"),
    createMotorcycleBrand
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteAllMotorcycleBrand
  );

motorcycleBrandRouter
  .route("/multiple")
  .post(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    createManyMotorcycleBrands
  );

motorcycleBrandRouter.route("/search").get(searchMotorcycleBrands);

motorcycleBrandRouter
  .route("/:motorcycleBrandId")
  .get(getMotorcycleBrandById)
  .patch(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    parseFiles.single("logo"),
    validateRequest(updateMotorcycleBrandSchema),
    uploadFilesToCloudinary("motorcycle-brand"),
    updateMotorcycleBrand
  )
  .delete(
    authMiddleware(),
    validateRole(["ADMIN", "SUPER_ADMIN"]),
    deleteMotorcycleBrand
  );

export default motorcycleBrandRouter;
