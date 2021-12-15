import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { BlogService } from 'src/app/shared/services/blog.service';
import { ConnectApiService } from 'src/app/shared/services/connect-api.service';
import { ProfileService } from '../../service/profile.service';
@Component({
  selector: 'app-profile-article',
  templateUrl: './profile-article.component.html',
  styleUrls: ['./profile-article.component.scss'],
})
export class ProfileArticleComponent implements OnInit, OnDestroy {
  public subscriptions = new Subscription();
  public param: any;
  public listArticle!: any;
  public Article!: boolean;
  public favorited!: boolean;
  public favoritedCount: any
  public isLoadingArticle: boolean = false;
  public length!: number;
  public offset: number = 0;
  public limit: number = 5;
  public newFeed: any;
  public pageIndex: number = 1;

  constructor(
    private profileService: ProfileService,
    private connectedService: ConnectApiService,
    private blogService: BlogService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.isLoadingArticle = true;

    const listArticles = this.profileService.currentArticles.pipe(switchMap(articles =>
      this.connectedService.onGetMultiArticlesByAuthor(this.limit, this.offset, articles)
    ))
      .subscribe((data: any) => {
        this.listArticle = data.articles;
        this.length = data.articlesCount;
        this.isLoadingArticle = false;

      }, error => {
        this.blogService.handerError(error);
        this.isLoadingArticle = false;
      })
    this.subscriptions.add(listArticles);
  }
  handlePage(e: any) {
    this.offset = e.pageIndex * e.pageSize;
    this.pageIndex = e.pageIndex;
    this.limit = e.pageSize;
    const page = this.profileService.currentArticles.pipe(switchMap(articles =>
      this.connectedService.onGetMultiArticlesByAuthor(this.limit, this.offset, articles)
    ))
      .subscribe((data: any) => {
        this.listArticle = data.articles;

      })
    window.scrollTo(0, 500);
    this.subscriptions.add(page);

  }
  onFavoriteArticle(slug: string, index: number) {
    if (this.blogService.isLogin()) {
      const favorited = this.connectedService.onFavoriteArticle(slug)
        .subscribe((favorite) => {
          this.listArticle[index].favorited = favorite.article.favorited;
          this.listArticle[index].favoritesCount = favorite.article.favoritesCount;
          this.blogService.succesSwal('success', `Favorited ${this.listArticle[index].author.username} successfully!`)
        }
          , (err) => this.blogService.handerError(err))
      this.subscriptions.add(favorited);
    }
    else {
      this.blogService.questionSwal('You need to login to perform this task ?')
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('auth/login')
          }
        })
    }

  }

  onUnfavoriteArticle(slug: string, index: number) {
    if (this.blogService.isLogin()) {
      const unfavorited = this.connectedService.onUnfavoriteArticle(slug)
        .subscribe((favorite) => {
          this.listArticle[index].favorited = favorite.article.favorited;
          this.listArticle[index].favoritesCount = favorite.article.favoritesCount;
          this.blogService.succesSwal('success', `Unfavorited ${this.listArticle[index].author.username} successfully!`)
        }, (err) => this.blogService.handerError(err))
      this.subscriptions.add(unfavorited);
    }
    else {
      this.blogService.questionSwal('You need to login to perform this task ?')
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('auth/login')
          }
        })
    }
  }
  public ngOnDestroy(): void {
    if (this.subscriptions && !this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
  }
  showImages(i: number) {
    return ((this.pageIndex + 1) * i) % 10;
  }
}


