import { Router } from "express";
import * as taskController from "../controllers/task.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/authorize.ts";
import { validate } from "../middleware/validate.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { idParamSchema } from "../validators/common.validator.ts";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator.ts";

export const taskRoutes = Router();

taskRoutes.use(authenticate);

taskRoutes
  .route("/")
  .get(asyncHandler(taskController.listTasks))
  .post(authorize("admin", "project_manager"), validate(createTaskSchema), asyncHandler(taskController.createTask));

taskRoutes
  .route("/:id")
  .get(validate(idParamSchema), asyncHandler(taskController.getTask))
  .patch(validate(updateTaskSchema), asyncHandler(taskController.updateTask))
  .delete(authorize("admin", "project_manager"), validate(idParamSchema), asyncHandler(taskController.deleteTask));
