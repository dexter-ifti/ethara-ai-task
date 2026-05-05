import { z } from "zod";
import { objectIdSchema } from "./common.validator.ts";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(1000).optional(),
    members: z.array(objectIdSchema).optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      description: z.string().trim().max(1000).optional(),
      members: z.array(objectIdSchema).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update"),
});
