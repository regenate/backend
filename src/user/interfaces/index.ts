import { ExperienceLevelEnum } from '@src/enums/experience-level';
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

  readonly authenticatePassword: (string) => Promise<boolean>;
}

export interface Mentor extends Document {
  user: string | User;
  country?: string;
  language?: string;
  mentorExpertise?: ExpertiseEnum;
  experienceLevel?: ExperienceLevelEnum;
  companyOrSchool?: string;
  jobTitle?: string;
  linkedlnUrl?: string;
  mentorTopic?: TopicEnum[];
  avatar?: string;
  bio?: string;
}

export interface Mentee extends Document {
  user: string | User;
  country?: string;
  language?: string;
  expertise?: ExpertiseEnum;
  experienceLevel?: ExperienceLevelEnum;
  linkedlnUrl?: string;
  gitHubUrl?: string;
  figmaPortfolioUrl?: string;
}
