import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { security } from "../../config/security";
import { env } from "../../config/env";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email, password, name);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    res.cookie(security.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: security.REFRESH_TOKEN_MAX_AGE_MS,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.COOKIE_DOMAIN,
    });

    res.status(200).json({ success: true, user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies[security.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      res.status(401).json({ success: false, message: "No refresh token provided" });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshUserToken(refreshToken);

    res.cookie(security.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: security.REFRESH_TOKEN_MAX_AGE_MS,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.COOKIE_DOMAIN,
    });

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const refreshToken = req.cookies[security.REFRESH_TOKEN_COOKIE_NAME];
    
    if (userId && refreshToken) {
      await authService.logoutUser(userId, refreshToken);
    }
    
    res.clearCookie(security.REFRESH_TOKEN_COOKIE_NAME);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
