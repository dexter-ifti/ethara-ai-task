import { Router } from "express";
import * as authController from "../controllers/auth.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { loginSchema, signupSchema } from "../validators/auth.validator.ts";

export const authRoutes = Router();

authRoutes.post("/signup", validate(signupSchema), asyncHandler(authController.signup));
authRoutes.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/refresh", asyncHandler(authController.refresh));
authRoutes.post("/logout", authenticate, asyncHandler(authController.logout));
