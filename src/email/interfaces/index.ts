import { Mail } from '../types';

export interface EmailService {
  sendMail: (mail: Mail) => Promise<void>;
}

export interface VerifyEmailPayload {
  verifyLink: string;
}

export interface ResetPasswordPayload {
  resetLink: string;
}
