import { z } from "zod";

export const createMotorcycleModelYearSchema = z.object({
  body: z
    .object({
      motorcycleModelId: z.string({
        required_error: "Motorcycle model ID is required",
      }),
      year: z.number({ required_error: "Year is required" }),
    })
    .strict(),
});

export const updateMotorcycleModelYearSchema = z.object({
  body: createMotorcycleModelYearSchema.shape.body.partial(),
});

export const createManyMotorcycleModelYearSchema = z.object({
  body: z
    .array(createMotorcycleModelYearSchema.shape.body)
    .min(1, "At least one motorcycle model year is required"),
});
