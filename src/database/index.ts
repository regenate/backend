export * from './constants';

export const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    /* eslint-disable no-param-reassign */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    transform: (_doc: any, ret: any): void => {
      delete ret._id;
      delete ret.__v;
    },
  },
};
