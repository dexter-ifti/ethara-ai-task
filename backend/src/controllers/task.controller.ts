import type { Request, Response } from "express";
import * as taskService from "../services/task.service.ts";

export async function createTask(req: Request, res: Response) {
  const task = await taskService.createTask(req.body, req.user!.id, req.user!.role === "admin");
  res.status(201).json({ task });
}

export async function listTasks(req: Request, res: Response) {
  const projectId = typeof req.query.project === "string" ? req.query.project : undefined;
  const tasks = await taskService.listTasks(req.user!.id, req.user!.role === "admin", projectId);
  res.status(200).json({ tasks });
}

export async function getTask(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const task = await taskService.getTask(id, req.user!.id, req.user!.role === "admin");
  res.status(200).json({ task });
}

export async function updateTask(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const task = await taskService.updateTask(id, req.body, req.user!.id, req.user!.role === "admin");
  res.status(200).json({ task });
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await taskService.deleteTask(id, req.user!.id, req.user!.role === "admin");
  res.status(204).send();
}
