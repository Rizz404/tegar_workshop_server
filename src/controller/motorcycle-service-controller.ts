import prisma from "@/configs/database";
import {
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
} from "@/types/api-response";
import logger from "@/utils/logger";
import { parseOrderBy, parsePagination } from "@/utils/query";
import { MotorcycleService } from "@prisma/client";
import { RequestHandler } from "express";

// *======================= POST =======================*
export const createManyMotorcycleServices: RequestHandler = async (
  req,
  res
) => {
  try {
    const payloads: MotorcycleService[] = req.body;

    const motorcycleServicesToCreate = payloads.map((payload, index) => ({
      ...payload,
    }));

    const createdMotorcycleServices = await prisma.motorcycleService.createMany(
      {
        data: motorcycleServicesToCreate,
        skipDuplicates: true, // Optional: skip duplicate entries
      }
    );

    return createSuccessResponse(
      res,
      createdMotorcycleServices,
      "Motorcycle services Created",
      201
    );
  } catch (error) {
    logger.error("Error creating multiple motorcycleServices:", error);
    return createErrorResponse(res, error, 500);
  }
};

export const createMotorcycleService: RequestHandler = async (req, res) => {
  try {
    const payload: MotorcycleService = req.body;

    const existingMotorcycleService = await prisma.motorcycleService.findUnique(
      {
        where: {
          name: payload.name,
        },
      }
    );

    if (existingMotorcycleService) {
      return createErrorResponse(res, "Motorcycle service already exist", 400);
    }

    const createdMotorcycleService = await prisma.motorcycleService.create({
      data: payload,
    });

    return createSuccessResponse(res, createdMotorcycleService, "Created", 201);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= GET =======================*
export const getMotorcycleServices: RequestHandler = async (req, res) => {
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
    const validFields = ["name", "price", "createdAt", "updatedAt"];
    const { field, direction } = parseOrderBy(
      orderBy,
      orderDirection,
      validFields
    );

    const motorcycleServices = await prisma.motorcycleService.findMany({
      skip: offset,
      take: +limit,
      orderBy: { [field]: direction },
    });
    const totalMotorcycleServices = await prisma.motorcycleService.count();

    createPaginatedResponse(
      res,
      motorcycleServices,
      currentPage,
      itemsPerPage,
      totalMotorcycleServices
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const getMotorcycleServiceById: RequestHandler = async (req, res) => {
  try {
    const { motorcycleServiceId } = req.params;
    const motorcycleService = await prisma.motorcycleService.findUnique({
      where: { id: motorcycleServiceId },
    });

    if (!motorcycleService) {
      return createErrorResponse(res, "Motorcycle service not found", 404);
    }

    return createSuccessResponse(res, motorcycleService);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const searchMotorcycleServices: RequestHandler = async (req, res) => {
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

    const motorcycleServices = await prisma.motorcycleService.findMany({
      where: { name: { mode: "insensitive", contains: name } },
      skip: offset,
      take: +limit,
      orderBy: { createdAt: "desc" },
    });
    const totalMotorcycleServices = await prisma.motorcycleService.count({
      where: { name: { mode: "insensitive", contains: name } },
    });

    createPaginatedResponse(
      res,
      motorcycleServices,
      currentPage,
      itemsPerPage,
      totalMotorcycleServices
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= PATCH =======================*
export const updateMotorcycleService: RequestHandler = async (req, res) => {
  try {
    const { motorcycleServiceId } = req.params;
    const payload: MotorcycleService = req.body;

    const motorcycleService = await prisma.motorcycleService.findUnique({
      where: {
        id: motorcycleServiceId,
      },
    });

    if (!motorcycleService) {
      return createErrorResponse(res, "Motorcycle service Not Found", 500);
    }

    const updatedMotorcycleService = await prisma.motorcycleService.update({
      data: payload,
      where: { id: motorcycleServiceId },
    });

    return createSuccessResponse(res, updatedMotorcycleService, "Updated");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= DELETE =======================*
export const deleteMotorcycleService: RequestHandler = async (req, res) => {
  try {
    const { motorcycleServiceId } = req.params;

    const motorcycleService = await prisma.motorcycleService.findUnique({
      where: {
        id: motorcycleServiceId,
      },
    });

    if (!motorcycleService) {
      return createErrorResponse(res, "Motorcycle service Not Found", 500);
    }

    const deletedMotorcycleService = await prisma.motorcycleService.delete({
      where: { id: motorcycleServiceId },
    });

    return createSuccessResponse(res, deletedMotorcycleService, "Deleted");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const deleteAllMotorcycleService: RequestHandler = async (req, res) => {
  try {
    const deletedAllMotorcycleServices =
      await prisma.motorcycleService.deleteMany();

    return createSuccessResponse(
      res,
      deletedAllMotorcycleServices,
      "All motorcycle models deleted"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};
