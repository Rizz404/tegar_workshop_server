import { z } from "zod";

export const createMotorcycleModelSchema = z.object({
  body: z
    .object({
      motorcycleBrandId: z.string({
        required_error: "Motorcycle brand ID is required",
      }),
      name: z
        .string({ required_error: "Motorcycle model name is required" })
        .min(2, "Name must be at least 2 characters"),
    })
    .strict(),
});

export const updateMotorcycleModelSchema = z.object({
  body: createMotorcycleModelSchema.shape.body.partial(),
});

export const createManyMotorcycleModelSchema = z.object({
  body: z
    .array(createMotorcycleModelSchema.shape.body)
    .min(1, "At least one motorcycle model is required"),
});
