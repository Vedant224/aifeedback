import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}