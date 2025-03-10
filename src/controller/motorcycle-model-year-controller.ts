import prisma from "@/configs/database";
import {
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
} from "@/types/api-response";
import logger from "@/utils/logger";
import { parseOrderBy, parsePagination } from "@/utils/query";
import { MotorcycleModelYear } from "@prisma/client";
import { RequestHandler } from "express";

// *======================= POST =======================*
export const createManyMotorcycleModelYears: RequestHandler = async (
  req,
  res
) => {
  try {
    const payloads: MotorcycleModelYear[] = req.body;

    const motorcycleModelYearsToCreate = payloads.map((payload, index) => ({
      ...payload,
    }));

    const createdMotorcycleModelYears =
      await prisma.motorcycleModelYear.createMany({
        data: motorcycleModelYearsToCreate,
        skipDuplicates: true,
      });

    return createSuccessResponse(
      res,
      createdMotorcycleModelYears,
      "Motorcycle model years Created",
      201
    );
  } catch (error) {
    logger.error("Error creating multiple motorcycleModelYears:", error);
    return createErrorResponse(res, error, 500);
  }
};

export const createMotorcycleModelYear: RequestHandler = async (req, res) => {
  try {
    const payload: MotorcycleModelYear = req.body;

    const existingMotorcycleModelYear =
      await prisma.motorcycleModelYear.findFirst({
        where: {
          AND: [
            { year: payload.year },
            { motorcycleModelId: payload.motorcycleModelId },
          ],
        },
      });

    if (existingMotorcycleModelYear) {
      return createErrorResponse(
        res,
        "Motorcycle Model Year already exist",
        400
      );
    }

    const createdMotorcycleModelYear = await prisma.motorcycleModelYear.create({
      data: payload,
    });

    return createSuccessResponse(
      res,
      createdMotorcycleModelYear,
      "Created",
      201
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= GET =======================*
export const getMotorcycleModelYears: RequestHandler = async (req, res) => {
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
    const validFields = ["createdAt", "updatedAt"];
    const { field, direction } = parseOrderBy(
      orderBy,
      orderDirection,
      validFields
    );

    const motorcycleModelYears = await prisma.motorcycleModelYear.findMany({
      include: { motorcycleModel: { select: { id: true, name: true } } },
      skip: offset,
      take: +limit,
      orderBy: { [field]: direction },
    });
    const totalMotorcycleModelYears = await prisma.motorcycleModelYear.count();

    createPaginatedResponse(
      res,
      motorcycleModelYears,
      currentPage,
      itemsPerPage,
      totalMotorcycleModelYears
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const getMotorcycleModelYearsByMotorcycleModelId: RequestHandler =
  async (req, res) => {
    try {
      const { motorcycleModelId } = req.params;
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

      const { currentPage, itemsPerPage, offset } = parsePagination(
        page,
        limit
      );
      const validFields = ["createdAt", "updatedAt"];
      const { field, direction } = parseOrderBy(
        orderBy,
        orderDirection,
        validFields
      );

      const motorcycleModelYears = await prisma.motorcycleModelYear.findMany({
        where: { motorcycleModelId },
        include: { motorcycleModel: { select: { id: true, name: true } } },
        skip: offset,
        take: +limit,
        orderBy: { [field]: direction },
      });
      const totalMotorcycleModelYears = await prisma.motorcycleModelYear.count({
        where: { motorcycleModelId },
      });

      createPaginatedResponse(
        res,
        motorcycleModelYears,
        currentPage,
        itemsPerPage,
        totalMotorcycleModelYears
      );
    } catch (error) {
      return createErrorResponse(res, error, 500);
    }
  };

export const getMotorcycleModelYearById: RequestHandler = async (req, res) => {
  try {
    const { motorcycleModelYearId } = req.params;
    const motorcycleModelYear = await prisma.motorcycleModelYear.findUnique({
      where: { id: motorcycleModelYearId },
      include: { motorcycleModel: { select: { id: true, name: true } } },
    });

    if (!motorcycleModelYear) {
      return createErrorResponse(res, "Motorcycle model year not found", 404);
    }

    return createSuccessResponse(res, motorcycleModelYear);
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const searchMotorcycleModelYears: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      yearFrom,
      yearTo,
    } = req.query as unknown as {
      page: string;
      limit: string;
      yearFrom?: string;
      yearTo?: string;
    };

    const { currentPage, itemsPerPage, offset } = parsePagination(page, limit);

    let whereClause = {};

    if (yearFrom && yearTo) {
      whereClause = {
        year: {
          gte: Number(yearFrom),
          lte: Number(yearTo),
        },
      };
    } else if (yearFrom) {
      whereClause = {
        year: {
          gte: Number(yearFrom),
        },
      };
    } else if (yearTo) {
      whereClause = {
        year: {
          lte: Number(yearTo),
        },
      };
    }

    const motorcycleModelYears = await prisma.motorcycleModelYear.findMany({
      where: whereClause,
      include: { motorcycleModel: { select: { id: true, name: true } } },
      skip: offset,
      take: +limit,
    });
    const totalMotorcycleModelYears = await prisma.motorcycleModelYear.count({
      where: whereClause,
    });

    createPaginatedResponse(
      res,
      motorcycleModelYears,
      currentPage,
      itemsPerPage,
      totalMotorcycleModelYears
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= PATCH =======================*
export const updateMotorcycleModelYear: RequestHandler = async (req, res) => {
  try {
    const { motorcycleModelYearId } = req.params;
    const payload: MotorcycleModelYear = req.body;

    const motorcycleModelYear = await prisma.motorcycleModelYear.findUnique({
      where: {
        id: motorcycleModelYearId,
      },
    });

    if (!motorcycleModelYear) {
      return createErrorResponse(res, "Motorcycle model year Not Found", 500);
    }

    const updatedMotorcycleModelYear = await prisma.motorcycleModelYear.update({
      data: payload,
      where: { id: motorcycleModelYearId },
    });

    return createSuccessResponse(res, updatedMotorcycleModelYear, "Updated");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

// *======================= DELETE =======================*
export const deleteMotorcycleModelYear: RequestHandler = async (req, res) => {
  try {
    const { motorcycleModelYearId } = req.params;

    const motorcycleModelYear = await prisma.motorcycleModelYear.findUnique({
      where: {
        id: motorcycleModelYearId,
      },
    });

    if (!motorcycleModelYear) {
      return createErrorResponse(res, "Motorcycle model year Not Found", 500);
    }

    const deletedMotorcycleModelYear = await prisma.motorcycleModelYear.delete({
      where: { id: motorcycleModelYearId },
    });

    return createSuccessResponse(res, deletedMotorcycleModelYear, "Deleted");
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};

export const deleteAllMotorcycleModelYear: RequestHandler = async (
  req,
  res
) => {
  try {
    const deletedAllMotorcycleModelYears =
      await prisma.motorcycleModelYear.deleteMany();

    return createSuccessResponse(
      res,
      deletedAllMotorcycleModelYears,
      "All motorcycle models deleted"
    );
  } catch (error) {
    return createErrorResponse(res, error, 500);
  }
};
