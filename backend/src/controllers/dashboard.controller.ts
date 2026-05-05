import type { Request, Response } from "express";
import { getDashboard as getDashboardData } from "../services/dashboard.service.ts";

export async function getDashboard(req: Request, res: Response) {
  const dashboard = await getDashboardData(req.user!.id, req.user!.role === "admin");
  res.status(200).json({ dashboard });
}
