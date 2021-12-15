import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary',
})
export class SummaryPipe implements PipeTransform {

  transform(
    value: string,
    totalCharacter: number = 25,
    character: string = ' ...'
  ): string {
    let length = value.length
    if (length >= totalCharacter) {
      return value.substring(0, totalCharacter) + character;
    } else if (length < totalCharacter && length > 0) {
      return value;
    } else {
      return ''
    }
  }
}
