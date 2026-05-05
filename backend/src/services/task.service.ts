import { Comment } from "../models/comment.model.ts";
import { Project } from "../models/project.model.ts";
import { Task } from "../models/task.model.ts";
import { User } from "../models/user.model.ts";
import { AppError } from "../utils/AppError.ts";
import type { z } from "zod";
import type { createTaskSchema, updateTaskSchema } from "../validators/task.validator.ts";

type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];

export async function createTask(input: CreateTaskInput, userId: string, isAdmin: boolean) {
  const project = await ensureProjectAccess(input.project, userId, isAdmin);
  await ensureAssigneeIsProjectMember(input.assignedTo, project.members.map(String));

  return Task.create({
    ...input,
    createdBy: userId,
  });
}

export async function listTasks(userId: string, isAdmin: boolean, projectId?: string) {
  const projectFilter = isAdmin ? {} : { members: userId };
  const accessibleProjects = await Project.find(projectFilter).select("_id");
  const projectIds = accessibleProjects.map((project) => project._id);

  if (projectId && !isAdmin && !projectIds.some((id) => id.equals(projectId))) {
    throw new AppError("You do not have access to this project", 403);
  }

  const filter = projectId ? { project: projectId } : { project: { $in: projectIds } };

  return Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });
}

export async function getTask(taskId: string, userId: string, isAdmin: boolean) {
  const task = await Task.findById(taskId)
    .populate("project", "name members")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  // project is already populated above, use it directly
  const project = task.project as unknown as { _id: string; members: { _id: { equals(id: string): boolean } }[] };
  if (!project || !project.members) {
    throw new AppError("Project not found", 404);
  }

  if (!isAdmin && !project.members.some((member) => member._id.equals(userId))) {
    throw new AppError("You do not have access to this task", 403);
  }

  return task;
}

export async function updateTask(taskId: string, input: UpdateTaskInput, userId: string, isAdmin: boolean) {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const project = await ensureProjectAccess(String(task.project), userId, isAdmin);
  await ensureAssigneeIsProjectMember(input.assignedTo, project.members.map(String));

  Object.assign(task, input);
  await task.save();
  return getTask(task.id, userId, isAdmin);
}

export async function deleteTask(taskId: string, userId: string, isAdmin: boolean) {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await ensureProjectAccess(String(task.project), userId, isAdmin);
  await Comment.deleteMany({ task: taskId });
  await task.deleteOne();
}

export async function ensureProjectAccess(projectId: string, userId: string, isAdmin: boolean) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (!isAdmin && !project.members.some((member) => member.equals(userId))) {
    throw new AppError("You do not have access to this project", 403);
  }

  return project;
}

async function ensureAssigneeIsProjectMember(assignedTo: string | undefined, memberIds: string[]) {
  if (!assignedTo) return;

  const userExists = await User.exists({ _id: assignedTo });
  if (!userExists) {
    throw new AppError("Assigned user does not exist", 400);
  }

  if (!memberIds.includes(assignedTo)) {
    throw new AppError("Assigned user must be a project member", 400);
  }
}
