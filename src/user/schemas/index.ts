import { schemaOptions } from '@src/database';
import { compare, hash } from 'bcryptjs';
import { Schema } from 'mongoose';
import { USER } from '../constants';
import { User } from '../interfaces';

export const UserSchema = new Schema(
  {
    username: String, // Check if unique before add
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerificationCode: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: Number,
      enum: [1, 2],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      /* eslint-disable no-param-reassign */
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      transform: (_doc: any, ret: any): void => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.emailVerificationCode;
      },
    },
  },
);

export const MentorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: true,
    },
    country: {
      type: String,
    },
    language: {
      type: String,
    },
    mentorExpertise: {
      type: Number,
    },

    experienceLevel: {
      type: Number,
    },
    companyOrSchool: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    linkedlnUrl: {
      type: String,
    },
    mentorTopic: [
      {
        type: Number,
      },
    ],
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  schemaOptions,
);

export const MenteeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: true,
    },
    country: {
      type: String,
    },
    language: {
      type: String,
    },
    expertise: {
      type: Number,
    },

    experienceLevel: {
      type: Number,
    },
    linkedlnUrl: {
      type: String,
    },
    gitHubUrl: {
      type: String,
    },
    figmaPortfolioUrl: {
      type: String,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  schemaOptions,
);

UserSchema.pre('save', async function hashPassword(next): Promise<void> {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const values = this as User;
  const passwordHash = await hash(values.password, 8);
  values.password = passwordHash;
  next();
});

UserSchema.methods = {
  async authenticatePassword(password: string): Promise<boolean> {
    return compare(password, (this as any).password);
  },
};
