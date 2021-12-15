import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BlogService } from 'src/app/shared/services/blog.service';
import { ConnectApiService } from 'src/app/shared/services/connect-api.service';

import { Article } from '../../../../shared/models/article.model';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})

export class ArticleListComponent implements OnInit,OnDestroy {
  //#region Properties
  public subscriptions = new Subscription();

  @ViewChild('paginator') paginator!: MatPaginator;

  public results: Article[] = [];
  public loading: boolean = true;
  public offset: number = 0;
  public limit: number = 5;
  public length: number = 0;
  public listConfig:any = {};
  public checkOffset:boolean = false;
  public articleNewFeed : string = '';
  public pageIndex : number = 0;

  public constructor(
    private connectApiService: ConnectApiService,
    private homeService: HomeService,
    private blogService : BlogService,
    private router : Router
  ) {}

  public ngOnInit(): void {
    const subArticle = this.homeService.tag
      .pipe(
        switchMap((name: any) => {
          if (name.type === 'all') {
            this.loading = true;
            this.listConfig = name;
            return this.connectApiService.onGetGlobalFeedArticles(
              this.limit,
              this.offset
            );
          } else if (name.type === 'feed') {
            this.loading = true;
            this.listConfig = name;
            return this.connectApiService.onGetMyFeedArticles(
              this.limit,
              this.offset
            );
          } else {
            this.loading = true;
            this.offset = 0
            this.listConfig = name;
            return this.connectApiService.onGetMultiArticlesByTag(
              this.limit,
              this.offset,
              name.filters
            );
          }
        })
      )
      .subscribe((res) => {
        this.paginator.firstPage();
        this.loading = false;
        this.results = res!.articles;
        this.length = res.articlesCount;
        if(this.listConfig.type === 'all') {
          this.articleNewFeed = this.results[0].slug
          this.homeService.setCountArticle(res.articlesCount)
        }
      },  (err) => {
        this.loading = false;
        this.blogService.handerError(err)
      })
      this.subscriptions.add(subArticle)
  }

  public tonggleFavorite(article: any, i: number) {
    if(this.blogService.isLogin()){
      if (article.favorited) {
        const subUnFavorite = this.connectApiService
          .onUnfavoriteArticle(article.slug)
          .subscribe((res) => {
            this.results[i].favoritesCount = res.article.favoritesCount;
            this.results[i].favorited = res.article.favorited;
            this.blogService.succesSwal("Success",`Unfavorited ${this.results[i].author.username} successfully!`)
          }, (err) => this.blogService.handerError(err));
          this.subscriptions.add(subUnFavorite);
      } else {
        const subFavorite = this.connectApiService
          .onFavoriteArticle(article.slug)
          .subscribe((res) => {
            this.results[i].favoritesCount = res.article.favoritesCount;
            this.results[i].favorited = res.article.favorited;
            this.blogService.succesSwal("Success",`Favorited ${this.results[i].author.username} successfully!`)
          }, (err) => this.blogService.handerError(err));
          this.subscriptions.add(subFavorite)
      }
    }
    else {
     this.blogService.questionSwal("You need to login to perform this task ?").then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('auth/login')
        }
      })
    }
  }
  
  public handlePage(e: any) {
    this.pageIndex = e.pageIndex
    if(this.listConfig.type === 'all') {
      this.offset = e.pageSize * e.pageIndex;
      this.limit = e.pageSize;
      const subPageAll = this.connectApiService
        .onGetGlobalFeedArticles(this.limit, this.offset)
        .subscribe((res: any) => {
          this.results = res.articles;
        },
        (err) => {
          this.blogService.handerError(err)
        }
      );
      this.subscriptions.add(subPageAll);
    }
    else if(this.listConfig.type === 'feed') {
      this.offset = e.pageSize * e.pageIndex;
      this.limit = e.pageSize;
      const subPageFeed = this.connectApiService
        .onGetMyFeedArticles(this.limit, this.offset)
        .subscribe((res: any) => {
          this.results = res.articles;
        },
        (err) => {
          this.blogService.handerError(err)
        });
      this.subscriptions.add(subPageFeed);
    }
    else if(this.listConfig.filters) {
      this.offset = e.pageSize * e.pageIndex;
      this.limit = e.pageSize;
      const subPageTag = this.connectApiService
        .onGetMultiArticlesByTag(this.limit, this.offset, this.listConfig.filters)
        .subscribe((res: any) => {
          this.results = res.articles;
        },
        (err) => {
          this.blogService.handerError(err)
        });
      this.subscriptions.add(subPageTag);
      }
      window.scrollTo(0, 700);
  }

  public setListTag(type: string = '', filters: any) {
    this.homeService.setTag({ type: type, filters: filters });
    scrollTo(0,700)
  }

  public showImages(i: number) {
    return ((this.pageIndex + 1) * i) % 10;
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.listConfig.type = 'all';
    this.listConfig.filters = '';
  }
}
