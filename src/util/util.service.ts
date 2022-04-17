import { Injectable } from '@nestjs/common';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { isEmpty } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class UtilService {
  /**
   * Format number by to n
   *
   * @param {number} value: length of decimal
   * @param {number} n: length of decimal
   * @param {number} x: length of sections
   */
  formatCurrency(value: string, n: number, x = 3): string {
    const re = `\\d(?=(\\d{${x}})+${n > 0 ? '\\.' : '$'})`;
    return (
      parseFloat(value)
        // eslint-disable-next-line no-bitwise
        .toFixed(Math.max(0, ~~n))
        .replace(new RegExp(re, 'g'), '$&,')
    );
  }

  generateRandom(length: number, chars?: string): string {
    let dict = chars;
    if (!chars) {
      dict = '0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ';
    }

    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += dict[Math.round(Math.random() * (dict.length - 1))];
    }
    return result;
  }

  parsePhonenumber(phonenumber = '', countryCode: CountryCode = 'NG'): string {
    if (isEmpty(phonenumber)) {
      return '';
    }

    let phone = phonenumber;
    if (phonenumber.startsWith('234')) {
      phone = `+${phonenumber}`;
    }
    const parsed = parsePhoneNumberFromString(phone, countryCode);

    if (isEmpty(parsed)) {
      return phonenumber;
    }

    return parsed.number.toString();
  }

  isValidDate(date: string): boolean {
    return moment(date).isValid();
  }

  generateOtp(length: number, chars?: string): string {
    let dict = chars;
    if (!dict) {
      dict = '0123456789';
    }
    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += dict[Math.round(Math.random() * (dict.length - 1))];
    }
    return result;
  }

  getNumberOfWeekdaysInMonth(monthStr: string): number {
    const monthStart = moment()
      .month(monthStr)
      .startOf('month')
      .add(1, 'hour');
    const monthEnd = moment()
      .month(monthStr)
      .endOf('month')
      .add(1, 'hour');

    return this.calculateWeekDays(monthStart, monthEnd);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  calculateWeekDays(startDate: any, endDate: any): number {
    const totalDays = endDate.diff(startDate, 'days') + 1;
    let startDay = startDate.day();
    let count = 0;

    for (let i = 0; i < totalDays; i += 1) {
      if (startDay > 0 && startDay < 6) count += 1;
      startDay += 1;
      if (startDay > 6) startDay = 0;
    }
    return count;
  }
}
