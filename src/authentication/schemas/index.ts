import { schemaOptions } from '@src/database';
import { USER } from '@src/user/constants';
import { Schema } from 'mongoose';

export const ResetRequestTokenSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);
