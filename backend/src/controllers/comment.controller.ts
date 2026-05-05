import type { Request, Response } from "express";
import * as commentService from "../services/comment.service.ts";

export async function createComment(req: Request, res: Response) {
  const comment = await commentService.createComment(req.body.task, req.body.message, req.user!.id, req.user!.role === "admin");
  res.status(201).json({ comment });
}

export async function listTaskComments(req: Request, res: Response) {
  const { taskId } = req.params as { taskId: string };
  const comments = await commentService.listTaskComments(taskId, req.user!.id, req.user!.role === "admin");
  res.status(200).json({ comments });
}
