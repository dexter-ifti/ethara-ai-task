import { User } from "../models/user.model.ts";
import { AppError } from "../utils/AppError.ts";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.ts";
import type { z } from "zod";
import type { loginSchema, signupSchema } from "../validators/auth.validator.ts";

type SignupInput = z.infer<typeof signupSchema>["body"];
type LoginInput = z.infer<typeof loginSchema>["body"];

export async function signup(input: SignupInput) {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create(input);
  return createAuthSession(user.id, user.role);
}

export async function login(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+password +refreshToken");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await user.comparePassword(input.password);
  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  return createAuthSession(user.id, user.role);
}

export async function refresh(refreshToken: string | undefined) {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.userId).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  return createAuthSession(user.id, user.role);
}

export async function logout(userId: string | undefined) {
  if (userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }
}

async function createAuthSession(userId: string, role: string) {
  const payload = { userId, role: role as "admin" | "project_manager" | "team_member" };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const user = await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
  return { accessToken, refreshToken, user };
}
