import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { security } from "../../config/security";

export const registerUser = async (email: string, password: string, name?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const password_hash = await bcrypt.hash(password, security.PASSWORD_SALT_ROUNDS);
  
  const user = await prisma.user.create({
    data: { email, password_hash, name },
  });

  return { id: user.id, email: user.email, name: user.name };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) throw new AppError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const token_hash = await bcrypt.hash(refreshToken, security.PASSWORD_SALT_ROUNDS);
  const expires_at = new Date(Date.now() + security.REFRESH_TOKEN_MAX_AGE_MS);

  await prisma.refreshToken.create({
    data: { user_id: user.id, token_hash, expires_at },
  });

  return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
};

export const refreshUserToken = async (refreshToken: string) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid refresh token", 401);
  }

  const userId = decoded.userId;

  const dbTokens = await prisma.refreshToken.findMany({
    where: { 
      user_id: userId,
      revoked_at: null,
      expires_at: { gt: new Date() }
    }
  });

  if (dbTokens.length === 0) {
    throw new AppError("Invalid refresh token", 401);
  }

  let matchingToken = null;
  for (const dbToken of dbTokens) {
    const isMatch = await bcrypt.compare(refreshToken, dbToken.token_hash);
    if (isMatch) {
      matchingToken = dbToken;
      break;
    }
  }

  if (!matchingToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  await prisma.refreshToken.update({
    where: { id: matchingToken.id },
    data: { revoked_at: new Date() }
  });

  const accessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  const newTokenHash = await bcrypt.hash(newRefreshToken, security.PASSWORD_SALT_ROUNDS);
  const expires_at = new Date(Date.now() + security.REFRESH_TOKEN_MAX_AGE_MS);

  await prisma.refreshToken.create({
    data: { user_id: userId, token_hash: newTokenHash, expires_at }
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (userId: string, refreshToken: string) => {
  const dbTokens = await prisma.refreshToken.findMany({
    where: { user_id: userId, revoked_at: null }
  });

  for (const dbToken of dbTokens) {
    const isMatch = await bcrypt.compare(refreshToken, dbToken.token_hash);
    if (isMatch) {
      await prisma.refreshToken.update({
        where: { id: dbToken.id },
        data: { revoked_at: new Date() }
      });
      break;
    }
  }
};
