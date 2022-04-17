import 'colors';
import { Logger } from './interfaces';

export class LoggerService implements Logger {
  log(...args: any[]): void {
    console.log('[LOG]'.yellow, ...args);
  }

  error(...args: any[]): void {
    console.log('[ERROR]'.red, ...args);
  }

  success(...args: any[]): void {
    console.log('[SUCCESS]'.green, ...args);
  }
}
