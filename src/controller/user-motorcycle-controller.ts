import prisma from "@/configs/database";
import {
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
} from "@/types/api-response";
import {
  deleteCloudinaryImage,
  deleteCloudinaryImages,
  isCloudinaryUrl,
} from "@/utils/cloudinary";
import logger from "@/utils/logger";
import { parseOrderBy, parsePagination } from "@/utils/query";
import { UserMotorcycle } from "@prisma/client";
import { RequestHandler } from "express";

// Todo: nanti upsert year buat create dan delete
// * *======================= POST =======================*
export const createManyUserMotorcycles: RequestHandler = async (req, res) => {
  try {
    const payloads: UserMotorcycle[] = req.body;

    const userMotorcyclesToCreate = payloads.map((payload, index) => ({
      ...payload,
    }));

    const createdUserMotorcycles = await prisma.userMotorcycle.createMany({
      data: userMotorcyclesToCreate,
      skipDuplicates: true,
    });

    return createSuccessResponse(
      res,
      createdUserMotorcycles,
      "User Motorcycles Created",
      201
    );
  } catch (error) {
    logger.error("Error creating multiple userMotorcycles:", error);
    return createErrorResponse(res, error, 500);
  }
};

export const createUserMotorcycle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;
    const { ...rest }: UserMotorcycle = req.body;
    const motorcycleImages = req.files as Express.Multer.File[];

    const motorcycleImageUrls =
      motorcycleImages
        ?.map((motorcycleImage) => motorcycleImage.cloudinary?.secure_url)
        .filter((url): url is string => typeof url === "string") || [];

    const createdUserMotorcycle = await prisma.userMotorcycle.create({
      data: {
        ...rest,
        userId: id,
        motorcycleImages: motorcycleImageUrls,
      },
    });

    return createSuccessResponse(res, createdUserMotorcycle, "Created", 201);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const createUserMotorcycleWithImagekit: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.user!;
    const payload: UserMotorcycle = req.body;
    const motorcycleImages = req.files as Express.Multer.File[];

    const motorcycleImageUrls =
      motorcycleImages
        ?.map((motorcycleImage) => motorcycleImage.imagekit?.url)
        .filter((url): url is string => typeof url === "string") || [];

    const createdUserMotorcycle = await prisma.userMotorcycle.create({
      data: {
        ...payload,
        userId: id,
        motorcycleImages: motorcycleImageUrls,
      },
    });

    return createSuccessResponse(res, createdUserMotorcycle, "Created", 201);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// * *======================= GET =======================*
export const getUserMotorcycles: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;
    const {
      page = "1",
      limit = "10",
      orderBy,
      orderDirection,
    } = req.query as unknown as {
      page: string;
      limit: string;
      orderBy?: string;
      orderDirection?: string;
    };

    const { currentPage, itemsPerPage, offset } = parsePagination(page, limit);
    const validFields = ["licensePlate", "createdAt", "updatedAt"];
    const { field, direction } = parseOrderBy(
      orderBy,
      orderDirection,
      validFields
    );

    const userMotorcycles = await prisma.userMotorcycle.findMany({
      where: { userId: id },
      include: {
        motorcycleModelYear: {
          select: {
            id: true,
            motorcycleModel: {
              select: {
                id: true,
                name: true,
                motorcycleBrand: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        user: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
      skip: offset,
      take: +limit,
      orderBy: { [field]: direction },
    });
    const totalUserMotorcycles = await prisma.userMotorcycle.count({
      where: { userId: id },
    });

    createPaginatedResponse(
      res,
      userMotorcycles,
      currentPage,
      itemsPerPage,
      totalUserMotorcycles
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const getUserMotorcycleById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;
    const { userMotorcycleId } = req.params;

    const userMotorcycle = await prisma.userMotorcycle.findUnique({
      where: { id: userMotorcycleId, userId: id },
      include: {
        motorcycleModelYear: {
          select: {
            id: true,
            motorcycleModel: {
              select: {
                id: true,
                name: true,
                motorcycleBrand: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        user: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
    });

    if (!userMotorcycle) {
      return createErrorResponse(res, "User Motorcycle not found", 404);
    }

    return createSuccessResponse(res, userMotorcycle);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const searchUserMotorcycles: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;
    const {
      page = "1",
      limit = "10",
      licensePlate,
    } = req.query as unknown as {
      page: string;
      limit: string;
      licensePlate: string;
    };

    const { currentPage, itemsPerPage, offset } = parsePagination(page, limit);

    const userMotorcycles = await prisma.userMotorcycle.findMany({
      where: {
        userId: id,
        licensePlate: { mode: "insensitive", contains: licensePlate },
      },
      include: {
        motorcycleModelYear: {
          select: {
            id: true,
            motorcycleModel: {
              select: {
                id: true,
                name: true,
                motorcycleBrand: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        user: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
      skip: offset,
      take: +limit,
    });
    const totalUserMotorcycles = await prisma.userMotorcycle.count({
      where: {
        userId: id,
        licensePlate: { mode: "insensitive", contains: licensePlate },
      },
    });

    createPaginatedResponse(
      res,
      userMotorcycles,
      currentPage,
      itemsPerPage,
      totalUserMotorcycles
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// * *======================= PATCH =======================*
export const updateUserMotorcycle: RequestHandler = async (req, res) => {
  try {
    const { id: userId } = req.user!;
    const { userMotorcycleId } = req.params;
    let {
      deleteImages = [],

      ...rest
    }: Partial<UserMotorcycle> & {
      deleteImages?: string[] | string;
    } = req.body;

    const motorcycleImages = req.files as Express.Multer.File[];

    // * Validasi dan proses deleteImages
    if (typeof deleteImages === "string") {
      try {
        deleteImages = JSON.parse(deleteImages) as string[];
      } catch (error) {
        return createErrorResponse(
          res,
          "Invalid JSON format for deleteImages",
          400
        );
      }
    }

    if (!Array.isArray(deleteImages)) {
      deleteImages = [];
    }

    // * Motorcyclei UserMotorcycle yang akan diupdate
    const userMotorcycle = await prisma.userMotorcycle.findUnique({
      where: { id: userMotorcycleId, userId },
      include: { motorcycleModelYear: true },
    });

    if (!userMotorcycle) {
      return createErrorResponse(res, "User Motorcycle Not Found", 404);
    }

    // * Proses gambar
    const addImages =
      motorcycleImages
        ?.map((img) => img.cloudinary?.secure_url)
        .filter((url): url is string => !!url) || [];

    let updatedImages = [...userMotorcycle.motorcycleImages];

    // * Hapus gambar yang dipilih
    if (deleteImages.length > 0) {
      updatedImages = updatedImages.filter(
        (img) => !deleteImages.includes(img)
      );
      await deleteCloudinaryImages(deleteImages);
    }

    // * Tambahkan gambar baru
    if (addImages.length > 0) {
      updatedImages = [...updatedImages, ...addImages];
    }

    // * Update data
    const updatedUserMotorcycle = await prisma.userMotorcycle.update({
      where: { id: userMotorcycleId },
      data: {
        ...rest,
        motorcycleImages: updatedImages,
      },
    });

    return createSuccessResponse(res, updatedUserMotorcycle, "Updated");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};
// * *======================= DELETE =======================*
export const deleteUserMotorcycle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;
    const { userMotorcycleId } = req.params;

    const userMotorcycle = await prisma.userMotorcycle.findUnique({
      where: {
        id: userMotorcycleId,
        userId: id,
      },
    });

    if (!userMotorcycle) {
      return createErrorResponse(res, "User Motorcycle Not Found", 404);
    }

    if (
      userMotorcycle.motorcycleImages &&
      userMotorcycle.motorcycleImages.length > 0
    ) {
      await deleteCloudinaryImages(userMotorcycle.motorcycleImages);
    }

    const deletedUserMotorcycle = await prisma.userMotorcycle.delete({
      where: { id: userMotorcycleId },
    });

    return createSuccessResponse(res, deletedUserMotorcycle, "Deleted");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const deleteAllUserMotorcycle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;

    // * Get all user motorcycles first to delete their images
    const userMotorcycles = await prisma.userMotorcycle.findMany({
      where: { userId: id },
      select: { motorcycleImages: true },
    });

    // * Collect all image URLs and delete them from Cloudinary
    const allImages = userMotorcycles
      .flatMap((motorcycle) => motorcycle.motorcycleImages || [])
      .filter((url) => url); // * Remove null/undefined

    if (allImages.length > 0) {
      await deleteCloudinaryImages(allImages);
    }

    const deletedAllUserMotorcycles = await prisma.userMotorcycle.deleteMany({
      where: { userId: id },
    });

    return createSuccessResponse(
      res,
      deletedAllUserMotorcycles,
      "All motorcycles deleted"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// * *======================= ADD & DELETE CAR IMAGES =======================*
export const addUserMotorcycleImage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;
    const { userMotorcycleId } = req.params;
    const motorcycleImages = req.files as Express.Multer.File[];

    const motorcycleImageUrls =
      motorcycleImages
        ?.map((motorcycleImage) => motorcycleImage.cloudinary?.secure_url)
        .filter((url): url is string => typeof url === "string") || [];

    const userMotorcycle = await prisma.userMotorcycle.findUnique({
      where: {
        id: userMotorcycleId,
        userId: id,
      },
    });

    if (!userMotorcycle) {
      return createErrorResponse(res, "User Motorcycle Not Found", 404);
    }

    const existingMotorcycleImages = userMotorcycle.motorcycleImages || [];

    const updatedMotorcycleImages = [
      ...existingMotorcycleImages,
      ...motorcycleImageUrls,
    ];

    const updatedUserMotorcycle = await prisma.userMotorcycle.update({
      where: { id: userMotorcycleId },
      data: {
        motorcycleImages: updatedMotorcycleImages,
      },
    });

    return createSuccessResponse(
      res,
      updatedUserMotorcycle,
      "Motorcycle Image Added"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const addUserMotorcycleImageWithImagekit: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.user!;
    const { userMotorcycleId } = req.params;
    const motorcycleImages = req.files as Express.Multer.File[];

    const motorcycleImageUrls =
      motorcycleImages
        ?.map((motorcycleImage) => motorcycleImage.imagekit?.url)
        .filter((url): url is string => typeof url === "string") || [];

    const userMotorcycle = await prisma.userMotorcycle.findUnique({
      where: {
        id: userMotorcycleId,
        userId: id,
      },
    });

    if (!userMotorcycle) {
      return createErrorResponse(res, "User Motorcycle Not Found", 404);
    }

    const existingMotorcycleImages = userMotorcycle.motorcycleImages || [];

    const updatedMotorcycleImages = [
      ...existingMotorcycleImages,
      ...motorcycleImageUrls,
    ];

    const updatedUserMotorcycle = await prisma.userMotorcycle.update({
      where: { id: userMotorcycleId },
      data: {
        motorcycleImages: updatedMotorcycleImages,
      },
    });

    return createSuccessResponse(
      res,
      updatedUserMotorcycle,
      "Motorcycle Image Added"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const deleteUserMotorcycleImage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user!;
    const { userMotorcycleId, index } = req.params;

    if (index === undefined) {
      return createErrorResponse(res, "Image index is required", 400);
    }

    const imageIndex = parseInt(index as string, 10);

    if (isNaN(imageIndex) || imageIndex < 0) {
      return createErrorResponse(res, "Invalid image index", 400);
    }

    const userMotorcycle = await prisma.userMotorcycle.findUnique({
      where: {
        id: userMotorcycleId,
        userId: id,
      },
    });

    if (!userMotorcycle) {
      return createErrorResponse(res, "User Motorcycle Not Found", 404);
    }

    if (
      !userMotorcycle.motorcycleImages ||
      imageIndex >= userMotorcycle.motorcycleImages.length
    ) {
      return createErrorResponse(
        res,
        "Image index out of bounds or no images available",
        400
      );
    }

    // * Get the image URL that will be deleted
    const imageToDelete = userMotorcycle.motorcycleImages[imageIndex];

    // * Delete from Cloudinary if it's a Cloudinary URL
    if (isCloudinaryUrl(imageToDelete)) {
      await deleteCloudinaryImage(imageToDelete);
    }

    const updatedMotorcycleImages = userMotorcycle.motorcycleImages.filter(
      (_, i) => i !== imageIndex
    );

    const updatedUserMotorcycle = await prisma.userMotorcycle.update({
      where: { id: userMotorcycleId },
      data: {
        motorcycleImages: updatedMotorcycleImages,
      },
    });

    return createSuccessResponse(
      res,
      updatedUserMotorcycle,
      "Motorcycle Image Deleted"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};
