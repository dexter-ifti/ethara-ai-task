import { Router } from "express";
import * as projectController from "../controllers/project.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/authorize.ts";
import { validate } from "../middleware/validate.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { idParamSchema } from "../validators/common.validator.ts";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.ts";

export const projectRoutes = Router();

projectRoutes.use(authenticate);

projectRoutes
  .route("/")
  .get(asyncHandler(projectController.listProjects))
  .post(authorize("admin", "project_manager"), validate(createProjectSchema), asyncHandler(projectController.createProject));

projectRoutes
  .route("/:id")
  .get(validate(idParamSchema), asyncHandler(projectController.getProject))
  .patch(authorize("admin", "project_manager"), validate(updateProjectSchema), asyncHandler(projectController.updateProject))
  .delete(authorize("admin", "project_manager"), validate(idParamSchema), asyncHandler(projectController.deleteProject));
