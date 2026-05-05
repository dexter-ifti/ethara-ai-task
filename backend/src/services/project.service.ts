import { Types } from "mongoose";
import { Comment } from "../models/comment.model.ts";
import { Project } from "../models/project.model.ts";
import { Task } from "../models/task.model.ts";
import { User } from "../models/user.model.ts";
import { AppError } from "../utils/AppError.ts";
import type { z } from "zod";
import type { createProjectSchema, updateProjectSchema } from "../validators/project.validator.ts";

type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];

export async function createProject(input: CreateProjectInput, ownerId: string) {
  const members = normalizeMembers([...(input.members ?? []), ownerId]);
  await ensureUsersExist(members);

  return Project.create({
    name: input.name,
    description: input.description,
    owner: ownerId,
    members,
  });
}

export async function listProjects(userId: string, isAdmin: boolean) {
  const filter = isAdmin ? {} : { members: userId };
  return Project.find(filter).populate("owner", "name email role").populate("members", "name email role");
}

export async function getProject(projectId: string, userId: string, isAdmin: boolean) {
  const project = await Project.findById(projectId).populate("owner", "name email role").populate("members", "name email role");
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (!isAdmin && !project.members.some((member) => member._id.equals(userId))) {
    throw new AppError("You do not have access to this project", 403);
  }

  return project;
}

export async function updateProject(projectId: string, input: UpdateProjectInput, userId: string, isAdmin: boolean) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (!isAdmin && !project.owner.equals(userId)) {
    throw new AppError("Only the project owner or admin can update this project", 403);
  }

  if (input.name !== undefined) project.name = input.name;
  if (input.description !== undefined) project.description = input.description;
  if (input.members !== undefined) {
    const members = normalizeMembers([...input.members, String(project.owner)]);
    await ensureUsersExist(members);
    project.members = members.map((id) => new Types.ObjectId(id));
  }

  await project.save();
  await project.populate("owner", "name email role");
  return project.populate("members", "name email role");
}

export async function deleteProject(projectId: string, userId: string, isAdmin: boolean) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (!isAdmin && !project.owner.equals(userId)) {
    throw new AppError("Only the project owner or admin can delete this project", 403);
  }

  const taskIds = await Task.find({ project: projectId }).distinct("_id");
  await Comment.deleteMany({ task: { $in: taskIds } });
  await Task.deleteMany({ project: projectId });
  await project.deleteOne();
}

function normalizeMembers(memberIds: string[]) {
  return [...new Set(memberIds.map(String))];
}

async function ensureUsersExist(userIds: string[]) {
  const count = await User.countDocuments({ _id: { $in: userIds } });
  if (count !== userIds.length) {
    throw new AppError("One or more project members do not exist", 400);
  }
}
