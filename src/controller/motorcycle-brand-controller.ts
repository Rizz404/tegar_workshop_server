import prisma from "@/configs/database";
import {
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
} from "@/types/api-response";
import {
  isCloudinaryUrl,
  deleteCloudinaryImage,
  deleteCloudinaryImages,
} from "@/utils/cloudinary";
import logger from "@/utils/logger";
import { parseOrderBy, parsePagination } from "@/utils/query";
import { MotorcycleBrand } from "@prisma/client";
import { RequestHandler } from "express";

// *======================= POST =======================*
export const createManyMotorcycleBrands: RequestHandler = async (req, res) => {
  try {
    const { ...rest }: MotorcycleBrand[] = req.body;

    const logos = req.files as Express.Multer.File[];

    const motorcycleBrandsToCreate = rest.map((payload, index) => ({
      ...payload,
      ...(logos &&
        logos[index] && {
          logo: logos[index].cloudinary?.secure_url!,
        }),
    }));

    const createdMotorcycleBrands = await prisma.motorcycleBrand.createMany({
      data: motorcycleBrandsToCreate,
      skipDuplicates: true,
    });

    return createSuccessResponse(
      res,
      createdMotorcycleBrands,
      "Motorcycle brands Created",
      201
    );
  } catch (error) {
    logger.error("Error creating multiple motorcycleBrands:", error);
    return createErrorResponse(res, error, 500);
  }
};

export const createMotorcycleBrand: RequestHandler = async (req, res) => {
  try {
    const { ...rest }: MotorcycleBrand = req.body;
    const logo = req.file as Express.Multer.File;

    const existingBrand = await prisma.motorcycleBrand.findUnique({
      where: { name: rest.name },
    });

    if (existingBrand) {
      return createErrorResponse(res, "Brand already exist", 400);
    }

    if (!logo) {
      return createErrorResponse(res, "Image is required", 400);
    }

    if (!logo.cloudinary?.secure_url) {
      return createErrorResponse(res, "Cloudinary error", 400);
    }

    const createdMotorcycleBrand = await prisma.motorcycleBrand.create({
      data: { ...rest, logo: logo.cloudinary.secure_url },
    });

    return createSuccessResponse(res, createdMotorcycleBrand, "Created", 201);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= GET =======================*
export const getMotorcycleBrands: RequestHandler = async (req, res) => {
  try {
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
    const validFields = ["name", "createdAt", "updatedAt"];
    const { field, direction } = parseOrderBy(
      orderBy,
      orderDirection,
      validFields
    );

    const motorcycleBrands = await prisma.motorcycleBrand.findMany({
      skip: offset,
      take: +limit,
      orderBy: { [field]: direction },
    });
    const totalMotorcycleBrands = await prisma.motorcycleBrand.count();

    createPaginatedResponse(
      res,
      motorcycleBrands,
      currentPage,
      itemsPerPage,
      totalMotorcycleBrands
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const getMotorcycleBrandById: RequestHandler = async (req, res) => {
  try {
    const { motorcycleBrandId } = req.params;
    const motorcycleBrand = await prisma.motorcycleBrand.findUnique({
      where: { id: motorcycleBrandId },
    });

    if (!motorcycleBrand) {
      return createErrorResponse(res, "Motorcycle brand not found", 404);
    }

    return createSuccessResponse(res, motorcycleBrand);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const searchMotorcycleBrands: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      name,
    } = req.query as unknown as {
      page: string;
      limit: string;
      name: string;
    };

    const { currentPage, itemsPerPage, offset } = parsePagination(page, limit);

    const motorcycleBrands = await prisma.motorcycleBrand.findMany({
      where: { name: { mode: "insensitive", contains: name } },
      skip: offset,
      take: +limit,
    });
    const totalMotorcycleBrands = await prisma.motorcycleBrand.count({
      where: { name: { mode: "insensitive", contains: name } },
    });

    createPaginatedResponse(
      res,
      motorcycleBrands,
      currentPage,
      itemsPerPage,
      totalMotorcycleBrands
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= PATCH =======================*
export const updateMotorcycleBrand: RequestHandler = async (req, res) => {
  try {
    const { motorcycleBrandId } = req.params;
    const { ...rest }: MotorcycleBrand = req.body;
    const logo = req.file as Express.Multer.File;

    if (logo && !logo.cloudinary?.secure_url) {
      return createErrorResponse(res, "Cloudinary error", 400);
    }

    const motorcycleBrand = await prisma.motorcycleBrand.findUnique({
      where: {
        id: motorcycleBrandId,
      },
    });

    if (!motorcycleBrand) {
      return createErrorResponse(res, "Motorcycle brand Not Found", 404);
    }

    if (logo && logo.cloudinary && logo.cloudinary.secure_url) {
      const imageToDelete = motorcycleBrand.logo;

      if (isCloudinaryUrl(imageToDelete)) {
        await deleteCloudinaryImage(imageToDelete);
      }
    }

    const updatedMotorcycleBrand = await prisma.motorcycleBrand.update({
      data: {
        ...rest,
        ...(logo && logo.cloudinary && { logo: logo.cloudinary.secure_url }),
      },
      where: { id: motorcycleBrandId },
    });

    return createSuccessResponse(res, updatedMotorcycleBrand, "Updated");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= DELETE =======================*
export const deleteMotorcycleBrand: RequestHandler = async (req, res) => {
  try {
    const { motorcycleBrandId } = req.params;

    const motorcycleBrand = await prisma.motorcycleBrand.findUnique({
      where: {
        id: motorcycleBrandId,
      },
    });

    if (!motorcycleBrand) {
      return createErrorResponse(res, "Motorcycle brand Not Found", 404);
    }

    const imageToDelete = motorcycleBrand.logo;

    if (isCloudinaryUrl(imageToDelete)) {
      await deleteCloudinaryImage(imageToDelete);
    }

    const deletedMotorcycleBrand = await prisma.motorcycleBrand.delete({
      where: { id: motorcycleBrandId },
    });

    return createSuccessResponse(res, deletedMotorcycleBrand, "Deleted");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const deleteAllMotorcycleBrand: RequestHandler = async (req, res) => {
  try {
    const motorcycleBrands = await prisma.motorcycleBrand.findMany({
      select: { logo: true },
    });

    const allImages = motorcycleBrands
      .flatMap((motorcycle) => motorcycle.logo)
      .filter((url) => url); // Remove null/undefined

    if (allImages.length > 0) {
      await deleteCloudinaryImages(allImages);
    }

    const deletedAllMotorcycleBrands =
      await prisma.motorcycleBrand.deleteMany();

    return createSuccessResponse(
      res,
      deletedAllMotorcycleBrands,
      "All motorcycle brands deleted"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};
