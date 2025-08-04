import { Request } from 'express';
import { User } from './user.js';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface PaginatedRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    [key: string]: any;
  };
}

export interface FilteredRequest extends Request {
  query: {
    status?: string;
    category?: string;
    [key: string]: any;
  };
}