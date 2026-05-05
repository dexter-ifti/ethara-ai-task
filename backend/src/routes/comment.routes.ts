import { Router } from "express";
import * as commentController from "../controllers/comment.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { createCommentSchema, taskCommentsSchema } from "../validators/comment.validator.ts";

export const commentRoutes = Router();

commentRoutes.use(authenticate);

commentRoutes.post("/", validate(createCommentSchema), asyncHandler(commentController.createComment));
commentRoutes.get("/task/:taskId", validate(taskCommentsSchema), asyncHandler(commentController.listTaskComments));
