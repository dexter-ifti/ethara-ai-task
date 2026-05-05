import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");

export const idParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
