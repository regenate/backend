import { compare, hash } from 'bcryptjs';
import { Schema } from 'mongoose';
import { USER } from '../constants';
import { User } from '../interfaces';

export const UserTypeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

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
