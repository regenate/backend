export enum RequestTokenExpireTime {
  ThirtyMinutes = '30 minutes',
  OneHour = '1 hour',
  OneDay = '1 day',
}

export type Authorize = 'mentor' | 'mentee';

export const RequestTokenExpireTimes = Object.values(RequestTokenExpireTime);
