import type { Request, Response } from "express";
import ms from "ms";
import { env } from "../config/env.ts";
import * as authService from "../services/auth.service.ts";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue),
};

export async function signup(req: Request, res: Response) {
  const session = await authService.signup(req.body);
  res.cookie("refreshToken", session.refreshToken, refreshCookieOptions);
  res.status(201).json({ accessToken: session.accessToken, user: session.user });
}

export async function login(req: Request, res: Response) {
  const session = await authService.login(req.body);
  res.cookie("refreshToken", session.refreshToken, refreshCookieOptions);
  res.status(200).json({ accessToken: session.accessToken, user: session.user });
}

export async function refresh(req: Request, res: Response) {
  const session = await authService.refresh(req.cookies.refreshToken);
  res.cookie("refreshToken", session.refreshToken, refreshCookieOptions);
  res.status(200).json({ accessToken: session.accessToken, user: session.user });
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.user?.id);
  res.clearCookie("refreshToken", refreshCookieOptions);
  res.status(204).send();
}
