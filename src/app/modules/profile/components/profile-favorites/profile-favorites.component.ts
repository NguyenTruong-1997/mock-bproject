import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { ProfileService } from '../../service/profile.service';
import { ConnectApiService } from '../../../../shared/services/connect-api.service';
import { switchMap } from 'rxjs/operators';
import { BlogService } from 'src/app/shared/services/blog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-favorites',
  templateUrl: './profile-favorites.component.html',
  styleUrls: ['./profile-favorites.component.scss'],
})
export class ProfileFavoritesComponent implements OnInit, OnDestroy {

  public subscriptions = new Subscription();
  public listFavorites!: any[] ;
  public favorited!: boolean;
  public favoritedCount: any = [];
  public isLoadingFavorites: boolean = false;
  public length!: number;
  public offset: number = 0;
  public limit: number = 5;
  public newFeed: any;
  public pageIndex: number = 1;

  constructor(
    private profileService: ProfileService,
    private ConnectApiService: ConnectApiService,
    private blogService: BlogService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.isLoadingFavorites = true;
    const listArticles = this.profileService.currentArticles.pipe(switchMap(articles =>
      this.ConnectApiService.onGetMultiArticlesByFavorited(this.limit, this.offset, articles)
    ))
      .subscribe((data) => {
        [this.newFeed, ...this.listFavorites] = data.articles
        this.length = data.articlesCount;
        this.isLoadingFavorites = false;
      }, error => {
        this.blogService.handerError(error);
        this.isLoadingFavorites = false;
        this.subscriptions.add(listArticles);

      });
  }

  handlePage(e: any) {
    this.offset = e.pageIndex * e.pageSize;
    this.limit = e.pageSize;
    const page = this.profileService.currentArticles.pipe(switchMap(articles =>
      this.ConnectApiService.onGetMultiArticlesByFavorited(this.limit, this.offset, articles)
    ))
      .subscribe((data: any) => {
        this.listFavorites = data.articles
      }, (err) => this.blogService.handerError(err))
    window.scrollTo(0, 500);
    this.subscriptions.add(page);
  }

  onFavoriteArticle(slug: string, index: number) {
    if (this.blogService.isLogin()) {
      const favorited = this.ConnectApiService.onFavoriteArticle(slug).subscribe((favorite) => {
        this.listFavorites[index].favorited = favorite.article.favorited;
        this.listFavorites[index].favoritesCount = favorite.article.favoritesCount;
        this.blogService.succesSwal('success', `Favorited ${this.listFavorites[index].author.username} successfully!`)
      }, (err) => this.blogService.handerError(err))
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
      const unfavorited = this.ConnectApiService.onUnfavoriteArticle(slug).subscribe((favorite) => {
        this.listFavorites[index].favorited = favorite.article.favorited;
        this.listFavorites[index].favoritesCount = favorite.article.favoritesCount;
        this.blogService.succesSwal('success', `Unfavorited ${this.listFavorites[index].author.username} successfully!`)
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
