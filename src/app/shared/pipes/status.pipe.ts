import { Pipe, PipeTransform} from '@angular/core';
import { ITodoItem } from '../interfaces';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
  transform(items: ITodoItem[], status: string): ITodoItem[] {
    return items.filter(item => {
      const test = status === 'completed';

      if (status) {
        return item.completed === test;
      }

      return true;
    });
  }
}
