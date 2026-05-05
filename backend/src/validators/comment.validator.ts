import { z } from "zod";
import { objectIdSchema } from "./common.validator.ts";

export const createCommentSchema = z.object({
  body: z.object({
    task: objectIdSchema,
    message: z.string().trim().min(1).max(1000),
  }),
});

export const taskCommentsSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
});
