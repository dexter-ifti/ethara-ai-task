import type { Request, Response } from "express";
import * as userService from "../services/user.service.ts";

export async function listUsers(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search : "";
  const users = await userService.listUsers(search);
  res.status(200).json({ users });
}
