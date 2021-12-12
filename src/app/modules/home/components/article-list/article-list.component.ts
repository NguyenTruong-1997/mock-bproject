import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BlogService } from 'src/app/shared/services/blog.service';
import { ConnectApiService } from 'src/app/shared/services/connect-api.service';
import Swal from 'sweetalert2';

import { Article } from '../../../../shared/models/article.model';
import { HomeService } from '../../service/home.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})

export class ArticleListComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;

  results: Article[] = [];
  loading: boolean = true;
  offset: number = 0;
  limit: number = 5;
  length: number = 0;
  listConfig:any = {};
  checkOffset:boolean = false;

  constructor(
    private connectApiService: ConnectApiService,
    private homeService: HomeService,
    private blogService : BlogService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.homeService.tag
      .pipe(
        switchMap((name: any) => {
          if (name.type === 'all') {
            this.loading = true;
            this.listConfig = name;
            console.log(name.type);
            return this.connectApiService.onGetGlobalFeedArticles(
              this.limit,
              this.offset
            );
          } else if (name.type === 'feed') {
            this.loading = true;
            this.listConfig = name;
            console.log(name.type);
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
      },  (err) => {
        this.connectApiService.handerError(err,this.loading)
      })
  }

  tonggleFavorite(article: any, i: number) {
    if(this.blogService.isLogin()){
      if (article.favorited) {
        this.connectApiService
          .onUnfavoriteArticle(article.slug)
          .subscribe((res) => {
            this.results[i].favoritesCount = res.article.favoritesCount;
            this.results[i].favorited = res.article.favorited;
          });
        console.log('del');
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `UnFavorited!`,
          showConfirmButton: false,
          width: '20rem',
          timer: 1500
        })
      } else {
        this.connectApiService
          .onFavoriteArticle(article.slug)
          .subscribe((res) => {
            this.results[i].favoritesCount = res.article.favoritesCount;
            this.results[i].favorited = res.article.favorited;
          });
        console.log('post');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Favorited!`,
          showConfirmButton: false,
          width: '20rem',
          timer: 1500
        })
      }
    }
    else {
      Swal.fire({
        title: 'You need to login to perform this task ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0f0e15',
        cancelButtonColor: '#ff7b7b',
        iconColor: '#0f0e15',
        confirmButtonText: 'Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('auth/login')
        }
      })
    }
  }
  handlePage(e: any) {
    if(this.listConfig.type === 'all') {
      this.offset = e.pageSize * e.pageIndex;
      this.limit = e.pageSize;
      this.connectApiService
        .onGetGlobalFeedArticles(this.limit, this.offset)
        .subscribe((res: any) => {
          this.results = res.articles;
        },
        (err) => {
          this.connectApiService.handerError(err)
        }
      );
    }
    else if(this.listConfig.type === 'feed') {
      this.offset = e.pageSize * e.pageIndex;
      this.limit = e.pageSize;
      this.connectApiService
        .onGetMyFeedArticles(this.limit, this.offset)
        .subscribe((res: any) => {
          this.results = res.articles;
        },
        (err) => {
          this.connectApiService.handerError(err)
        });
    }
    else if(this.listConfig.filters) {
      this.offset = e.pageSize * e.pageIndex;
      this.limit = e.pageSize;
      this.connectApiService
        .onGetMultiArticlesByTag(this.limit, this.offset, this.listConfig.filters)
        .subscribe((res: any) => {
          this.results = res.articles;
        },
        (err) => {
          this.connectApiService.handerError(err)
        });
      }
      window.scrollTo(0, 0);
  }
}
