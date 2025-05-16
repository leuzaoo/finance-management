import { Response } from "express";

const COOKIE_NAME = "token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function setAuthCookie(res: Response, token: string): Response {
  return res.cookie(COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res: Response): Response {
  return res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
}
