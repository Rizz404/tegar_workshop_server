import {
  createUserMotorcycle,
  createManyUserMotorcycles,
  deleteAllUserMotorcycle,
  deleteUserMotorcycle,
  getUserMotorcycleById,
  getUserMotorcycles,
  searchUserMotorcycles,
  updateUserMotorcycle,
  addUserMotorcycleImage,
  deleteUserMotorcycleImage,
  addUserMotorcycleImageWithImagekit,
  createUserMotorcycleWithImagekit,
} from "@/controller/user-motorcycle-controller";
import { authMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validate-request";
import {
  parseFiles,
  uploadFilesToCloudinary,
  uploadFilesToImageKit,
} from "@/middlewares/upload-file";
import {
  createUserMotorcycleSchema,
  createManyUserMotorcycleSchema,
  updateUserMotorcycleSchema,
  addUserMotorcycleImageSchema,
} from "@/validation/user-motorcycle-validation";
import express from "express";

const userMotorcycleRouter = express.Router();

userMotorcycleRouter
  .route("/")
  .get(authMiddleware(), getUserMotorcycles)
  .post(
    authMiddleware(),
    parseFiles.array("motorcycleImages", 5),
    validateRequest(createUserMotorcycleSchema),
    uploadFilesToCloudinary("motorcycle-images"),
    createUserMotorcycle
  )
  .delete(authMiddleware(), deleteAllUserMotorcycle);

userMotorcycleRouter
  .route("/imagekit")
  .post(
    authMiddleware(),
    parseFiles.array("motorcycleImages", 5),
    validateRequest(createUserMotorcycleSchema),
    uploadFilesToImageKit("motorcycle-images"),
    createUserMotorcycleWithImagekit
  );

userMotorcycleRouter
  .route("/multiple")
  .post(
    authMiddleware(),
    validateRequest(createManyUserMotorcycleSchema),
    createManyUserMotorcycles
  );

userMotorcycleRouter
  .route("/search")
  .get(authMiddleware(), searchUserMotorcycles);

userMotorcycleRouter
  .route("/motorcycle-images/:userMotorcycleId/index/:index")
  .delete(authMiddleware(), deleteUserMotorcycleImage);

userMotorcycleRouter
  .route("/motorcycle-images/:userMotorcycleId")
  .post(
    authMiddleware(),
    parseFiles.array("motorcycleImages", 5),
    validateRequest(addUserMotorcycleImageSchema),
    uploadFilesToCloudinary("motorcycle-images"),
    addUserMotorcycleImage
  );

userMotorcycleRouter
  .route("/motorcycle-images/imagekit/:userMotorcycleId")
  .post(
    authMiddleware(),
    parseFiles.array("motorcycleImages", 5),
    validateRequest(addUserMotorcycleImageSchema),
    uploadFilesToImageKit("motorcycle-images"),
    addUserMotorcycleImageWithImagekit
  );

userMotorcycleRouter
  .route("/:userMotorcycleId")
  .get(authMiddleware(), getUserMotorcycleById)
  .patch(
    authMiddleware(),
    parseFiles.array("motorcycleImages", 5),
    validateRequest(updateUserMotorcycleSchema),
    uploadFilesToCloudinary("motorcycle-images"),
    updateUserMotorcycle
  )
  .delete(authMiddleware(), deleteUserMotorcycle);

export default userMotorcycleRouter;
