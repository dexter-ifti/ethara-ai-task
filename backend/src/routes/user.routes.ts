import { Router } from "express";
import * as userController from "../controllers/user.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/authorize.ts";
import { validate } from "../middleware/validate.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { listUsersSchema } from "../validators/user.validator.ts";

export const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.get("/", authorize("admin", "project_manager"), validate(listUsersSchema), asyncHandler(userController.listUsers));
