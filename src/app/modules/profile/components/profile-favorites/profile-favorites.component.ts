import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { ProfileService } from '../../service/profile.service';
import { ConnectApiService } from '../../../../shared/services/connect-api.service';
import { switchMap } from 'rxjs/operators';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-profile-favorites',
  templateUrl: './profile-favorites.component.html',
  styleUrls: ['./profile-favorites.component.scss'],
})
export class ProfileFavoritesComponent implements OnInit {
  public listFavorites!: any[];
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
    this.profileService.currentArticles.pipe(switchMap(articles =>
      this.ConnectApiService.onGetMultiArticlesByFavorited(this.limit, this.offset, articles)
    ))
      .subscribe((data) => {
        [this.newFeed, ...this.listFavorites] = data.articles
        this.length = data.articlesCount;
        this.isLoadingFavorites = false;
      }, error => {
        this.blogService.handerError(error);
        this.isLoadingFavorites = false;

      });
  }

  handlePage(e: any) {
    this.offset = e.pageIndex * e.pageSize;
    this.limit = e.pageSize;
    this.profileService.currentArticles.pipe(switchMap(articles =>
      this.ConnectApiService.onGetMultiArticlesByFavorited(this.limit, this.offset, articles)
    ))
      .subscribe((data: any) => {
        this.listFavorites = data.articles
      }, (err) => this.blogService.handerError(err))
    window.scrollTo(0, 500);
  }

  onFavoriteArticle(slug: string, index: number) {
    if (this.blogService.isLogin()) {
      this.ConnectApiService.onFavoriteArticle(slug).subscribe((favorite) => {
        this.listFavorites[index].favorited = favorite.article.favorited;
        this.listFavorites[index].favoritesCount = favorite.article.favoritesCount;
        this.blogService.succesSwal('success', `Favorited ${this.listFavorites[index].author.username} successfully!`)
      }, (err) => this.blogService.handerError(err))
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
      this.ConnectApiService.onUnfavoriteArticle(slug).subscribe((favorite) => {
        this.listFavorites[index].favorited = favorite.article.favorited;
        this.listFavorites[index].favoritesCount = favorite.article.favoritesCount;
        this.blogService.succesSwal('success', `Unfavorited ${this.listFavorites[index].author.username} successfully!`)
      }, (err) => this.blogService.handerError(err))
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

  showImages(i: number) {
    return ((this.pageIndex + 1) * i) % 10;
  }
}
