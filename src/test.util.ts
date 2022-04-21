import { Response } from 'express';
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

export const responseMocker = (obj: {
  data: any;
  status: number;
}): Response => {
  const resMock: Partial<Response> = {
    status(status: number) {
      obj.status = status;
      return this;
    },
    json(body: any) {
      obj.data = body;
      return this;
    },
  };

  return <Response>resMock;
};

export const randomEmail = (): string => {
  return `${Math.random()}@mail.com`;
};

export const randomString = (length = 5, chars?: string): string => {
  let dict = chars;
  if (!chars) {
    dict = '0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ';
  }

  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += dict[Math.round(Math.random() * (dict.length - 1))];
  }
  return result;
};
