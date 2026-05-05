import { Schema, model, Types, type HydratedDocument } from "mongoose";
import { taskPriorities, taskStatuses, type TaskPriority, type TaskStatus } from "../constants/taskStatus.ts";

export type TaskDocument = HydratedDocument<ITask>;

export type ITask = {
  title: string;
  description?: string;
  project: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
};

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: taskStatuses,
      default: "todo",
    },
    priority: {
      type: String,
      enum: taskPriorities,
      default: "medium",
    },
    dueDate: Date,
  },
  { timestamps: true },
);

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, dueDate: 1 });

export const Task = model<ITask>("Task", taskSchema);
