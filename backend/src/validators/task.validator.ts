import { z } from "zod";
import { taskPriorities, taskStatuses } from "../constants/taskStatus.ts";
import { objectIdSchema } from "./common.validator.ts";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(2000).optional(),
    project: objectIdSchema,
    assignedTo: objectIdSchema.optional(),
    status: z.enum(taskStatuses).optional(),
    priority: z.enum(taskPriorities).optional(),
    dueDate: z.coerce.date().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      title: z.string().trim().min(2).max(160).optional(),
      description: z.string().trim().max(2000).optional(),
      assignedTo: objectIdSchema.optional(),
      status: z.enum(taskStatuses).optional(),
      priority: z.enum(taskPriorities).optional(),
      dueDate: z.coerce.date().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update"),
});
