// src/validations/user-motorcycle.validation.ts
import { filesArraySchema } from "@/utils/file-vallidation";
import { z } from "zod";

export const createUserMotorcycleSchema = z.object({
  body: z
    .object({
      motorcycleModelYearColorId: z.string().optional(),
      colorId: z.string().optional(),
      motorcycleModelYearId: z.string().optional(),
      licensePlate: z.string({ required_error: "License plate is required" }),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (data.motorcycleModelYearColorId) {
        if (data.colorId || data.motorcycleModelYearId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Cannot combine motorcycleModelYearColorId with colorId/motorcycleModelYearId",
            path: ["motorcycleModelYearColorId"],
          });
        }
        return;
      }

      if (!data.colorId && !data.motorcycleModelYearId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Either motorcycleModelYearColorId or both colorId and motorcycleModelYearId are required",
          path: ["colorId"],
        });
        return;
      }

      if (data.colorId && !data.motorcycleModelYearId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "motorcycleModelYearId is required when using colorId",
          path: ["motorcycleModelYearId"],
        });
      }

      if (data.motorcycleModelYearId && !data.colorId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "colorId is required when using motorcycleModelYearId",
          path: ["colorId"],
        });
      }
    }),
  files: filesArraySchema.optional(),
});

export const updateUserMotorcycleSchema = z.object({
  body: z
    .object({
      motorcycleModelYearColorId: z.string().optional(),
      colorId: z.string().optional(),
      motorcycleModelYearId: z.string().optional(),
      licensePlate: z.string().optional(),
    })
    .partial()
    .superRefine((data: Record<string, any>, ctx: z.RefinementCtx) => {
      // Validasi untuk update partial
      if (
        data.motorcycleModelYearColorId &&
        (data.colorId || data.motorcycleModelYearId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Cannot combine motorcycleModelYearColorId with colorId/motorcycleModelYearId",
          path: ["motorcycleModelYearColorId"],
        });
      }

      if (data.colorId && !data.motorcycleModelYearId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "motorcycleModelYearId is required when updating colorId",
          path: ["motorcycleModelYearId"],
        });
      }

      if (data.motorcycleModelYearId && !data.colorId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "colorId is required when updating motorcycleModelYearId",
          path: ["colorId"],
        });
      }
    }),
});

export const createManyUserMotorcycleSchema = z.object({
  body: z
    .array(
      z.object({
        motorcycleModelYearColorId: z.string().optional(),
        colorId: z.string().optional(),
        motorcycleModelYearId: z.string().optional(),
        licensePlate: z.string({ required_error: "License plate is required" }),
      })
    )
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (
          item.motorcycleModelYearColorId &&
          (item.colorId || item.motorcycleModelYearId)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Cannot combine motorcycleModelYearColorId with colorId/motorcycleModelYearId",
            path: [index, "motorcycleModelYearColorId"],
          });
        }

        if (
          !item.motorcycleModelYearColorId &&
          !(item.colorId && item.motorcycleModelYearId)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Either motorcycleModelYearColorId or both colorId and motorcycleModelYearId are required",
            path: [index],
          });
        }
      });
    }),
});

export const addUserMotorcycleImageSchema = z.object({
  files: filesArraySchema,
});
