import { Component, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { BlogService } from 'src/app/shared/services/blog.service';
import { ConnectApiService } from 'src/app/shared/services/connect-api.service';
import { ProfileService } from '../../service/profile.service';
@Component({
  selector: 'app-profile-article',
  templateUrl: './profile-article.component.html',
  styleUrls: ['./profile-article.component.scss'],
})
export class ProfileArticleComponent implements OnInit {
  param: any;
  listArticle!: any;
  Article!: boolean;
  favorited!: boolean;
  favoritedCount: any
  isLoadingArticle: boolean = false;
  length!: number;
  offset: number = 0;
  limit: number = 5;
  newFeed: any;
  pageIndex: number = 1;
  constructor(
    private profileService: ProfileService,
    private connectedService: ConnectApiService,
    private blogService: BlogService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.isLoadingArticle = true;

    this.profileService.currentArticles.pipe(switchMap(articles =>
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
  }
  handlePage(e: any) {
    this.offset = e.pageIndex * e.pageSize;

    this.pageIndex = e.pageIndex;
    this.limit = e.pageSize;
    this.profileService.currentArticles.pipe(switchMap(articles =>
      this.connectedService.onGetMultiArticlesByAuthor(this.limit, this.offset, articles)
    ))
      .subscribe((data: any) => {
        this.listArticle = data.articles;

      })
    window.scrollTo(0, 500);

  }
  onFavoriteArticle(slug: string, index: number) {
    if (this.blogService.isLogin()) {
      this.connectedService.onFavoriteArticle(slug)
        .subscribe((favorite) => {
          this.listArticle[index].favorited = favorite.article.favorited;
          this.listArticle[index].favoritesCount = favorite.article.favoritesCount;
          this.blogService.succesSwal('success', `Favorited ${this.listArticle[index].author.username} successfully!`)
        }
        ,(err) => this.blogService.handerError(err))
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
      this.connectedService.onUnfavoriteArticle(slug)
        .subscribe((favorite) => {
          this.listArticle[index].favorited = favorite.article.favorited;
          this.listArticle[index].favoritesCount = favorite.article.favoritesCount;
          this.blogService.succesSwal('success', `Unfavorited ${this.listArticle[index].author.username} successfully!`)
        },(err) => this.blogService.handerError(err))
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


