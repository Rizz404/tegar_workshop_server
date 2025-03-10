import { z } from "zod";

export const createMotorcycleModelColorSchema = z.object({
  body: z
    .object({
      motorcycleModelId: z.string({
        required_error: "Motorcycle model ID is required",
      }),
      name: z
        .string({ required_error: "Color name is required" })
        .min(1, "Name must be at least 1 character"),
    })
    .strict(),
});

export const updateMotorcycleModelColorSchema = z.object({
  body: createMotorcycleModelColorSchema.shape.body.partial(),
});

export const createManyMotorcycleModelColorSchema = z.object({
  body: z
    .array(createMotorcycleModelColorSchema.shape.body)
    .min(1, "At least one motorcycle model color is required"),
});
