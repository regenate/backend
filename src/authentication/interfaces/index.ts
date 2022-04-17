import { User } from '@src/user';
import { Document } from 'mongoose';

export interface RequestResetToken extends Document {
  token: string;
  user: User;
  isUsed?: boolean;
  isDeleted?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: Record<string, unknown>; // or can be anythin
    }
  }
}
