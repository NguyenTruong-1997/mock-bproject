import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/shared/services/blog.service';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-article-feed',
  templateUrl: './article-feed.component.html',
  styleUrls: ['./article-feed.component.scss'],
})
export class ArticleFeedComponent implements OnInit,OnDestroy {
  //#region Properties
  public subscriptions = new Subscription();

  public listConfig: any = {
    type: 'all',
    filters: '',
  };

  public constructor(private homeService: HomeService,private blogService: BlogService,
    private router: Router) {}

  public ngOnInit(): void {
    const subList = this.homeService.tag.subscribe((res) => {
      this.listConfig = res;
    });
    this.subscriptions.add(subList);
  }

  public setListTo(type: string = '', filters?: '') {
    if (type === 'feed' && !this.blogService.isLogin()) {
      this.blogService.questionSwal("You need to login to perform this task ?").then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('auth/login')
        }
        
      })
    }
    else{
      this.homeService.setTag({ type: type, filters: filters });
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}