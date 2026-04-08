import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysRemaining',
})
export class DaysRemainingPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
