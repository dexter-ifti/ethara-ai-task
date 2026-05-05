import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.ts";
import { AppError } from "../utils/AppError.ts";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({
    message: "Internal server error",
    ...(env.NODE_ENV !== "production" ? { error: String(error) } : {}),
  });
};
