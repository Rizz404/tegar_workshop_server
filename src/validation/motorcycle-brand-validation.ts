import { fileSchema } from "@/utils/file-vallidation";
import { z } from "zod";

export const createMotorcycleBrandSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required"),
      country: z
        .string()
        .min(3, "Country must be at least 3 characters")
        .optional(),
    })
    .strict(),
  file: fileSchema,
});

export const updateMotorcycleBrandSchema = z.object({
  body: createMotorcycleBrandSchema.shape.body.partial(),
});

export const createManyMotorcycleBrandSchema = z.object({
  body: z
    .array(
      createMotorcycleBrandSchema
        .omit({ file: true })
        .shape.body.extend({ logo: z.string().optional() })
    )
    .min(1, "At least one motorcycle brand is required"),
});
