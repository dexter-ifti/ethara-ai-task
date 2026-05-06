import { z } from "zod";

export const listUsersSchema = z.object({
  query: z.object({
    search: z.string().trim().max(120).optional(),
  }),
});
