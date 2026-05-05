import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", authenticate, asyncHandler(getDashboard));
