import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HomeService {

  public constructor(
  ) {}

  tag$ = new BehaviorSubject<{}>({type : 'all', filters: ''});
  tag = this.tag$.asObservable();

  countArticle$ = new BehaviorSubject<number>(0);
  countArticle = this.countArticle$.asObservable();

  setTag(value: any) {
    this.tag$.next(value);
  }
  setCountArticle(value: any) {
    this.countArticle$.next(value);
  }


}
