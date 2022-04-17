import { Document } from 'mongoose';

export interface User extends Document {
  username?: string;
  password: string;
  email: string;
  emailVerificationCode?: string;
  emailVerified?: boolean;
  isDeleted?: boolean;

  readonly authenticatePassword: (string) => Promise<boolean>;
}
