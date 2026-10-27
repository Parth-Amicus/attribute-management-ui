
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime', //register pipe under the name used in html
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: Date | string | null | undefined): string { //Date for js date object
    if (value === null || value === undefined) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value); //covertin into object of Date if not in

    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }
// calculating difference 
    const now = new Date();   // current date
    const difference = now.getTime() - date.getTime();
    const absoluteDifference = Math.abs(difference);
    const isFuture = difference < 0;

    // Show "just now" for dates less than 10 seconds away
    if (absoluteDifference < 10_000) { 
      return 'just now';
    }

    let result: string;
// converting milisecods in seconds, minutes hours and days 
    const seconds = Math.floor(absoluteDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      result = `${seconds} second${seconds === 1 ? '' : 's'}`;
    } else if (hours < 1) {
      result = `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else if (days < 1) {
      result = `${hours} hour${hours === 1 ? '' : 's'}`;
    } else if (days < 30) {
      result = `${days} day${days === 1 ? '' : 's'}`;
    } else {
      // Calculate calendar months rather than assuming every month contains exactly 30 days
      let totalMonths =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());

      if (now.getDate() < date.getDate()) {
        totalMonths--;
      }

      totalMonths = Math.max(1, totalMonths);

      if (totalMonths < 12) {
        result = `${totalMonths} month${totalMonths === 1 ? '' : 's'}`;
      } else {
        const years = Math.floor(totalMonths / 12);
        const remainingMonths = totalMonths % 12;

        result = `${years} year${years === 1 ? '' : 's'}`;

        if (remainingMonths > 0) {
          result += ` ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
        }
      }
    }

    return isFuture ? `in ${result}` : `${result} ago`;
  }
}
