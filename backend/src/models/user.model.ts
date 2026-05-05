import bcrypt from "bcrypt";
import { Schema, model, type HydratedDocument, type Model } from "mongoose";
import { roles, type Role } from "../constants/roles.ts";

export type UserDocument = HydratedDocument<IUser>;

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: Role;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
};

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: roles,
      default: "team_member",
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set("toJSON", {
  transform(_doc, ret) {
    const safeRet = ret as Partial<IUser>;
    delete safeRet.password;
    delete safeRet.refreshToken;
    return ret;
  },
});

export const User = model<IUser, UserModel>("User", userSchema);
