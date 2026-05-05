import type { Request, Response } from "express";
import * as projectService from "../services/project.service.ts";

export async function createProject(req: Request, res: Response) {
  const project = await projectService.createProject(req.body, req.user!.id);
  res.status(201).json({ project });
}

export async function listProjects(req: Request, res: Response) {
  const projects = await projectService.listProjects(req.user!.id, req.user!.role === "admin");
  res.status(200).json({ projects });
}

export async function getProject(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const project = await projectService.getProject(id, req.user!.id, req.user!.role === "admin");
  res.status(200).json({ project });
}

export async function updateProject(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const project = await projectService.updateProject(id, req.body, req.user!.id, req.user!.role === "admin");
  res.status(200).json({ project });
}

export async function deleteProject(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await projectService.deleteProject(id, req.user!.id, req.user!.role === "admin");
  res.status(204).send();
}
