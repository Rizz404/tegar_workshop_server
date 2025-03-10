import { z } from "zod";

export const createMotorcycleModelYearColorSchema = z.object({
  body: z
    .object({
      motorcycleModelYearId: z.string({
        required_error: "Motorcycle model year ID is required",
      }),
      colorId: z.string({ required_error: "Color ID is required" }),
    })
    .strict(),
});

export const updateMotorcycleModelYearColorSchema = z.object({
  body: createMotorcycleModelYearColorSchema.shape.body.partial(),
});

export const createManyMotorcycleModelYearColorSchema = z.object({
  body: z
    .array(createMotorcycleModelYearColorSchema.shape.body)
    .min(1, "At least one motorcycle model year is required"),
});
