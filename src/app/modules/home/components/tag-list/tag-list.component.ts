import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectApiService } from 'src/app/shared/services/connect-api.service';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit,OnDestroy {
  //#region Properties
  public subscriptions = new Subscription();

  public tags: any = [];
  public tagsLoaded = false;
  public listConfig: any = {
    type: 'all',
    filters: {},
  };

  public constructor(
    private homeService: HomeService,
    private connectApiService: ConnectApiService,

  ) {}

  public ngOnInit(): void {
    this.subscriptions = this.connectApiService.onGetGlobalFeedArticles(500,0).subscribe(
      (data) => {
        if (data) {
          let arrayTag : any = []
          data.articles.forEach((el) => arrayTag.push(el.tagList));
          this.tags = this.popularTag(arrayTag.flat())
        }
      }
    )
  }

  popularTag(arr : any) {
    let cloneArr : any  = [...new Set(arr)];
    let countArr : any = []
    cloneArr.forEach((el : any) => {
      let count = 0
      arr.forEach((els : any) => {
        if(el === els) {
          count++
        }
      })
      countArr.push(count);
    })
    
    let arrArticle :any[]= []
    countArr.forEach((el : any,idxCount : number) => {

       cloneArr.forEach(( elc : any, idxClone : number) => {
         if(idxClone === idxCount) {
          arrArticle.push({tag : elc, count : el})
        }
      })

    })
    arrArticle.sort((a,b) => {
      return b.count - a.count
    })
    return arrArticle.slice(0,10)
  }

  public setListTo(type: string = '', filters: any) {
    this.homeService.setTag({ type: type, filters: filters });
    scrollTo(0,700)
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
