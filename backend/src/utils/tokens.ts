import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env.ts";
import type { Role } from "../constants/roles.ts";

export type TokenPayload = {
  userId: string;
  role: Role;
};

export function signAccessToken(payload: TokenPayload) {
  return signToken(payload, env.JWT_ACCESS_SECRET, env.ACCESS_TOKEN_EXPIRES_IN as StringValue);
}

export function signRefreshToken(payload: TokenPayload) {
  return signToken(payload, env.JWT_REFRESH_SECRET, env.REFRESH_TOKEN_EXPIRES_IN as StringValue);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}

function signToken(payload: TokenPayload, secret: string, expiresIn: StringValue) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}
