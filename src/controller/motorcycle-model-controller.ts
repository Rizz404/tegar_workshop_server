import prisma from "@/configs/database";
import {
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
} from "@/types/api-response";
import logger from "@/utils/logger";
import { parseOrderBy, parsePagination } from "@/utils/query";
import { MotorcycleModel } from "@prisma/client";
import { RequestHandler } from "express";

// *======================= POST =======================*
export const createManyMotorcycleModels: RequestHandler = async (req, res) => {
  try {
    const payloads: MotorcycleModel[] = req.body;

    const createdMotorcycleModels = await prisma.motorcycleModel.createMany({
      data: payloads,
      skipDuplicates: true,
    });

    return createSuccessResponse(
      res,
      createdMotorcycleModels,
      "Motorcycle models Created",
      201
    );
  } catch (error) {
    logger.error("Error creating multiple motorcycleModels:", error);
    return createErrorResponse(res, error, 500);
  }
};

export const createMotorcycleModel: RequestHandler = async (req, res) => {
  try {
    const payload: MotorcycleModel = req.body;

    const existingMotorcycleModel = await prisma.motorcycleModel.findFirst({
      where: {
        AND: [
          { name: payload.name },
          { motorcycleBrandId: payload.motorcycleBrandId },
        ],
      },
    });

    if (existingMotorcycleModel) {
      return createErrorResponse(res, "Motorcycle Model already exist", 400);
    }

    const createdMotorcycleModel = await prisma.motorcycleModel.create({
      data: payload,
    });

    return createSuccessResponse(res, createdMotorcycleModel, "Created", 201);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= GET =======================*
export const getMotorcycleModels: RequestHandler = async (req, res) => {
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

    const motorcycleModels = await prisma.motorcycleModel.findMany({
      include: {
        motorcycleBrand: {
          select: { id: true, name: true, logo: true, country: true },
        },
      },
      skip: offset,
      take: +limit,
      orderBy: { [field]: direction },
    });
    const totalMotorcycleModels = await prisma.motorcycleModel.count();

    createPaginatedResponse(
      res,
      motorcycleModels,
      currentPage,
      itemsPerPage,
      totalMotorcycleModels
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const getMotorcycleModelsByBrandId: RequestHandler = async (
  req,
  res
) => {
  try {
    const { motorcycleBrandId } = req.params;
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

    const motorcycleModels = await prisma.motorcycleModel.findMany({
      where: { motorcycleBrandId: motorcycleBrandId },
      include: {
        motorcycleBrand: {
          select: { id: true, name: true, logo: true, country: true },
        },
      },
      skip: offset,
      take: +limit,
      orderBy: { [field]: direction },
    });
    const totalMotorcycleModels = await prisma.motorcycleModel.count({
      where: { motorcycleBrandId: motorcycleBrandId },
    });

    createPaginatedResponse(
      res,
      motorcycleModels,
      currentPage,
      itemsPerPage,
      totalMotorcycleModels
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const getMotorcycleModelById: RequestHandler = async (req, res) => {
  try {
    const { motorcycleModelId } = req.params;
    const motorcycleModel = await prisma.motorcycleModel.findUnique({
      where: { id: motorcycleModelId },
      include: {
        motorcycleBrand: {
          select: { id: true, name: true, logo: true, country: true },
        },
      },
    });

    if (!motorcycleModel) {
      return createErrorResponse(res, "Motorcycle model not found", 404);
    }

    return createSuccessResponse(res, motorcycleModel);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const searchMotorcycleModels: RequestHandler = async (req, res) => {
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

    const motorcycleModels = await prisma.motorcycleModel.findMany({
      where: { name: { mode: "insensitive", contains: name } },
      include: {
        motorcycleBrand: {
          select: { id: true, name: true, logo: true, country: true },
        },
      },
      skip: offset,
      take: +limit,
    });
    const totalMotorcycleModels = await prisma.motorcycleModel.count({
      where: { name: { mode: "insensitive", contains: name } },
    });

    createPaginatedResponse(
      res,
      motorcycleModels,
      currentPage,
      itemsPerPage,
      totalMotorcycleModels
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= PATCH =======================*
export const updateMotorcycleModel: RequestHandler = async (req, res) => {
  try {
    const { motorcycleModelId } = req.params;
    const payload: MotorcycleModel = req.body;

    const motorcycleModel = await prisma.motorcycleModel.findUnique({
      where: {
        id: motorcycleModelId,
      },
    });

    if (!motorcycleModel) {
      return createErrorResponse(res, "Motorcycle model Not Found", 500);
    }

    const updatedMotorcycleModel = await prisma.motorcycleModel.update({
      data: payload,
      where: { id: motorcycleModelId },
    });

    return createSuccessResponse(res, updatedMotorcycleModel, "Updated");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= DELETE =======================*
export const deleteMotorcycleModel: RequestHandler = async (req, res) => {
  try {
    const { motorcycleModelId } = req.params;

    const motorcycleModel = await prisma.motorcycleModel.findUnique({
      where: {
        id: motorcycleModelId,
      },
    });

    if (!motorcycleModel) {
      return createErrorResponse(res, "Motorcycle model Not Found", 500);
    }

    const deletedMotorcycleModel = await prisma.motorcycleModel.delete({
      where: { id: motorcycleModelId },
    });

    return createSuccessResponse(res, deletedMotorcycleModel, "Deleted");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const deleteAllMotorcycleModel: RequestHandler = async (req, res) => {
  try {
    const deletedAllMotorcycleModels =
      await prisma.motorcycleModel.deleteMany();

    return createSuccessResponse(
      res,
      deletedAllMotorcycleModels,
      "All motorcycle models deleted"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};
