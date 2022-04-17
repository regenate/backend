import { connection } from 'mongoose';

export async function collectionInitialize(): Promise<void> {
  const { models } = connection;
  await Promise.all(
    Object.keys(models).map(modelKey => {
      const model = models[modelKey];
      return model.createCollection();
    }),
  );
}

export const wait = async (milliseconds: number): Promise<void> => {
  await new Promise(resolve => {
    setTimeout(resolve, milliseconds, 'done');
  });
};
