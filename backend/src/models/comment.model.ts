import { Schema, model, Types, type HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<IComment>;

export type IComment = {
  task: Types.ObjectId;
  author: Types.ObjectId;
  message: string;
};

const commentSchema = new Schema<IComment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

commentSchema.index({ task: 1, createdAt: -1 });

export const Comment = model<IComment>("Comment", commentSchema);
