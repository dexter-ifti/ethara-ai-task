import { Schema, model, Types, type HydratedDocument } from "mongoose";

export type ProjectDocument = HydratedDocument<IProject>;

export type IProject = {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
};

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

projectSchema.index({ owner: 1, name: 1 });

export const Project = model<IProject>("Project", projectSchema);
