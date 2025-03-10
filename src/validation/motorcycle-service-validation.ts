import { z } from "zod";

export const createMotorcycleServiceSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Service name is required" })
        .min(2, "Name must be at least 2 characters"),
      price: z.coerce
        .number({
          required_error: "Price is required",
          invalid_type_error: "Price must be a number",
        })
        .positive("Price must be a positive number"),
    })
    .strict(),
});

export const updateMotorcycleServiceSchema = z.object({
  body: createMotorcycleServiceSchema.shape.body.partial(),
});

export const createManyMotorcycleServiceSchema = z.object({
  body: z
    .array(createMotorcycleServiceSchema.shape.body)
    .min(1, "At least one motorcycle service is required"),
});
