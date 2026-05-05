import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../utils/AppError.ts";
import { verifyAccessToken } from "../utils/tokens.ts";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    next(new AppError("Authentication token is required", 401));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    next(new AppError("Invalid or expired authentication token", 401));
  }
}
