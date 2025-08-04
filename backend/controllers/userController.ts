import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import userService from '../services/userService.js';
import logger from '../utils/logger.js';

export const registerUser = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  logger.info(`Registration attempt for email: ${email}`);

  const { user, token } = await userService.registerUser(name, email, password);

  logger.info(`User registered successfully: ${user.id}`);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const loginUser = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  logger.info(`Login attempt for email: ${email}`);

  const { user, token } = await userService.loginUser(email, password);

  logger.info(`User logged in successfully: ${user.id}`);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const getUserProfile = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUserProfile = asyncHandler(async (
  req: Request,
  res: Response,
  __next: NextFunction
): Promise<void> => {
  const { name, email } = req.body;
  const userId = req.user.id;

  logger.info(`Profile update for user: ${userId}`);

  const updatedUser = await userService.updateUserProfile(userId, name, email);

  logger.info(`User profile updated successfully: ${userId}`);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    },
  });
});