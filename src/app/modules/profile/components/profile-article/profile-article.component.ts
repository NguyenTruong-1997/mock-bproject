import { Component, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { Article, FormCreateArticle, SingleArticle } from 'src/app/shared/models/article.model';
import { AuthService } from 'src/app/shared/services/auth.service';
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
  favoritedCount:any = [];
  isLoadingArticle: boolean = false;
  length!: number;
  offset: number = 0;
  limit: number=5;
  newFeed: any;
  constructor(
    private profileService: ProfileService,
    private connectedService: ConnectApiService,
  ) {}

  ngOnInit(): void {
    this.isLoadingArticle = true;

    this.profileService.currentArticles.pipe(switchMap(articles =>
      this.connectedService.onGetMultiArticlesByAuthor(this.limit ,this.offset, articles)
    ))
    .subscribe((data : any) => {
      [this.newFeed, ...this.listArticle] = data.articles;
      this.length = data.articlesCount;
      this.isLoadingArticle = false;

    }, error => {
      console.log(error);
      this.isLoadingArticle = false;
    })
  }

  handlePage(e:any){
    this.offset = e.pageIndex * e.pageSize;
    this.limit = e.pageSize;
    this.profileService.currentArticles.pipe(switchMap(articles =>
      this.connectedService.onGetMultiArticlesByAuthor(this.limit ,this.offset,articles)
    ))
    .subscribe((data : any) => {
      [this.newFeed, ...this.listArticle] = data.articles
     })
  }

  onFavoriteArticle(slug: string, index: number){
    return this.connectedService.onFavoriteArticle(slug)
    .subscribe((favorite) => {
      this.listArticle[index].favorited = favorite.article.favorited;
      this.listArticle[index].favoritesCount = favorite.article.favoritesCount;
    })
  }

  onFavoritenew(slug: string){
    return this.connectedService.onFavoriteArticle(slug)
    .subscribe((favorite) => {
      this.newFeed.favorited = favorite.article.favorited;
      this.newFeed.favoritesCount = favorite.article.favoritesCount;
    })
  }
  onUnfavoriteArticle(slug: string, index: number){
    return this.connectedService.onUnfavoriteArticle(slug)
    .subscribe((favorite) => {
      this.listArticle[index].favorited = favorite.article.favorited;
      this.listArticle[index].favoritesCount = favorite.article.favoritesCount;
     })

   }

   onUnFavoritenew(slug: string){
    return this.connectedService.onUnfavoriteArticle(slug)
    .subscribe((favorite) => {
      this.newFeed.favorited = favorite.article.favorited;
      this.newFeed.favoritesCount = favorite.article.favoritesCount;
    })
  }
  }

