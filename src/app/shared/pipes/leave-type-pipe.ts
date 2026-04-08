import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leaveType',
})
export class LeaveTypePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
