import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import { Document } from 'mongoose';

export interface User extends Document {
  username?: string;
  password: string;
  email: string;
  emailVerificationCode?: string;
  emailVerified?: boolean;
  isDeleted?: boolean;
  bearerToken?: string;
  mentorExpertise?: ExpertiseEnum[];
  role?: RoleEnum;
  companyOrSchool?: string;
  jobTitle?: string;
  linkedlnUrl?: string;
  readonly authenticatePassword: (string) => Promise<boolean>;
}
