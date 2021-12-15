import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spliceTag',
})
export class SplicePipe implements PipeTransform {

transform(
  value: any[],
  totalTag: number = 5,
) {
  let length = value.length
  if (length >= totalTag) {
    return value.splice(0, totalTag);
  } else if(length < totalTag && length > 0){
    return value;
  } else {
    return []
  }
}
}
