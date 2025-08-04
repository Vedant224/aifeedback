import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateToken } from '../utils/jwt.js';
import { UserDocument } from '../models/User.js';
import logger from '../utils/logger.js';

interface UserServiceResult {
  user: UserDocument;
  token: string;
}

async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<UserServiceResult> {
  const userExists = await User.findOne({ email });
  if (userExists) {
    logger.warn(`Registration failed: Email already exists - ${email}`);
    throw new AppError('User already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    logger.error(`User creation failed for email: ${email}`);
    throw new AppError('Invalid user data', 400);
  }

  const token = generateToken(user._id.toString());

  return { user, token };
}

async function loginUser(
  email: string,
  password: string
): Promise<UserServiceResult> {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    logger.warn(`Login failed: User not found - ${email}`);
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    logger.warn(`Login failed: Incorrect password - ${email}`);
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user._id.toString());

  return { user, token };
}

async function updateUserProfile(
  userId: string,
  name?: string,
  email?: string
): Promise<UserDocument> {
  const user = await User.findById(userId);

  if (!user) {
    logger.error(`User update failed: User not found - ${userId}`);
    throw new AppError('User not found', 404);
  }

  if (name) {user.name = name;}
  if (email) {
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn(`User update failed: Email already exists - ${email}`);
        throw new AppError('Email already exists', 400);
      }
      user.email = email;
    }
  }

  return user.save();
}

export default {
  registerUser,
  loginUser,
  updateUserProfile,
};