import { Comment } from "../models/comment.model.ts";
import { Task } from "../models/task.model.ts";
import { AppError } from "../utils/AppError.ts";
import { ensureProjectAccess } from "./task.service.ts";

export async function createComment(taskId: string, message: string, userId: string, isAdmin: boolean) {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await ensureProjectAccess(String(task.project), userId, isAdmin);
  return Comment.create({ task: taskId, author: userId, message });
}

export async function listTaskComments(taskId: string, userId: string, isAdmin: boolean) {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await ensureProjectAccess(String(task.project), userId, isAdmin);
  return Comment.find({ task: taskId }).populate("author", "name email role").sort({ createdAt: -1 });
}
