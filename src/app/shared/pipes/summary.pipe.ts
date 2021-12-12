import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary',
})
export class SummaryPipe implements PipeTransform {
  transform(
    value: string,
    totalCharacter: number = 25,
    character: string = '...'
  ): string {
    if (value) {
      return value.substring(0, totalCharacter) + character;
    } else {
      return '';
    }
  }
}
