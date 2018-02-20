import { Pipe, PipeTransform} from '@angular/core';
import { ITodoItem } from '../interfaces';

@Pipe({ name: 'search'})
export class SearchPipe implements PipeTransform {
  transform(items: ITodoItem[], filter: string): ITodoItem[] {
    return items.filter(item => {
      return new RegExp(filter, 'gi').test(item.title);
    });
  }
}
