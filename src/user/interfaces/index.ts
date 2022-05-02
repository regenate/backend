import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import { TopicEnum } from '@src/enums/topic';
import { Document } from 'mongoose';

export interface User extends Document {
  username?: string;
  password: string;
  email: string;
  emailVerificationCode?: string;
  emailVerified?: boolean;
  isDeleted?: boolean;
  bearerToken?: string;
  role?: RoleEnum;
  mentorExpertise?: ExpertiseEnum[];
  companyOrSchool?: string;
  jobTitle?: string;
  linkedlnUrl?: string;
  mentorTopic?: TopicEnum[];
  readonly authenticatePassword: (string) => Promise<boolean>;
}
