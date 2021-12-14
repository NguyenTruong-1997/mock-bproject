import { Article } from './../../shared/models/article.model';
import { ConnectApiService } from './../../shared/services/connect-api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Comment } from './../../shared/models/article.model';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, filter } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Profile } from 'src/app/shared/models/profile.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GetUser } from 'src/app/shared/models/user.model';
import { forkJoin } from 'rxjs';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit, OnDestroy {
  public subscriptions = new Subscription();
  //#region Properties
  public profile!: Profile;
  public article!: Article;
  public articleComment: Comment[] = [];
  public currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')!);
  public isLoading!: boolean;
  public isLoadingComment!: boolean;
  public isLogin: boolean = false;
  public disabledFollow!:boolean;
  public disabledFavorite!: boolean;
  //#end region

  //#region Constructor
  public constructor(
    private getAPI: ConnectApiService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private blogService: BlogService,
  ) {}

  //#end region

  //#region Methods
  public ngOnInit(): void {
    this.isLoading = true;
    const currenUserSub = this.authService.currentUser.subscribe((user: GetUser | null) => {
      this.isLogin = !user ? false : true;
    });

    const paramSub = this.route.params.subscribe((res) => {
      forkJoin([
        this.getAPI.onGetArticleBySlug(res.slug),
        this.getAPI.onGetComment(res.slug),
      ])
        .pipe(
          filter(data => {
            this.article = data[0].article;
            this.articleComment = data[1].comments.reverse();
            this.isLoading = false;
            return data[0].article.author.username !== this.currentUser?.user.username;
          }),
          switchMap((data): any => {
            return this.getAPI.onGetProfile(data[0].article.author.username);
          })
        )
        .subscribe(
          (res: any) => {
            this.profile = res.profile;
          },
          (err) => {
            console.log(err);
            this.blogService.errorSwal('Oops...','Something went wrong!');
            this.router.navigate([' page-not-found ']);
          }
        );
    });

    this.subscriptions.add(currenUserSub);
    this.subscriptions.add(paramSub);
  }

  public addComment(comment: NgForm) {
    this.isLoadingComment = true;
    const getAddComment = this.getAPI
      .onAddComment({ body: comment.value.comment }, this.article.slug)
      .subscribe(
        (data: any) => {
          this.articleComment.unshift(data.comment);
        },
        (err) => {
          console.log(err);
          this.blogService.errorSwal('Oops...','Something went wrong!');
          this.router.navigate([' page-not-found ']);
        },
        () => {
          this.isLoadingComment = false;
        }
      );

    this.subscriptions.add(getAddComment);
  }

  public deleteComment(id: any) {
    const index = this.articleComment.findIndex((comment) => comment.id === id);
    const deleteSub = this.getAPI.onDeleteComment(this.article.slug, id).subscribe(
      () => {
        this.articleComment.splice(index, 1);
        this.blogService.succesSwal('Delete!','Your comment has been deleted sucessfully');
      },
      (err) => {
        console.log(err);
      }
    );

    this.subscriptions.add(deleteSub);
  }
  //#end region
  public favoriteArticle() {
    if (!this.isLogin) {
      this.blogService.questionSwal('You need login to do this!').then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['auth/login']);
        }
      });
    } else {
      this.disabledFavorite = true;
      const getFavoriteArticle = this.getAPI
        .onFavoriteArticle(this.article.slug)
        .subscribe(
          (data: any) => {
            this.article = data.article;
            this.blogService.succesSwal('Succesfully','You haved favorited this article!');
            this.disabledFavorite = false;
          },
          (err) => {
            console.log(err);
            this.blogService.errorSwal('Oops...','Something went wrong!');
          }
        );

      this.subscriptions.add(getFavoriteArticle);
    }
  }

  public unFavoriteArticle() {
    this.disabledFavorite = true;
    const getUnFavoriteArticle = this.getAPI
      .onUnfavoriteArticle(this.article.slug)
      .subscribe(
        (data: any) => {
          this.article = data.article;
          this.blogService.succesSwal('Succesfully','You haved unfavorited this article!');
          this.disabledFavorite = false;
        },
        (err) => {
          console.log(err);
            this.blogService.errorSwal('Oops...','Something went wrong!');
        }
      );

    this.subscriptions.add(getUnFavoriteArticle);
  }

  public followArticle() {
    if (!this.isLogin) {
      this.blogService.questionSwal('You need login to do this!').then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['auth/login']);
        }
      });
    } else {
      this.disabledFollow = true;
      const getFollowArticle = this.getAPI
        .onFollowUser(this.profile.username)
        .subscribe(
          (follow) => {
            this.disabledFollow = false;
            this.profile.following = follow.profile.following!;
            this.blogService.succesSwal('Succesfully','You haved follow this author!');
          },
          (err) => {
            console.log(err);
            this.blogService.errorSwal('Oops...','Something went wrong!');
          }
        );

      this.subscriptions.add(getFollowArticle);
    }
  }

  public unfollowArticle() {
    this.disabledFollow = true;
    const getUnfollowArticle = this.getAPI
      .onUnfollowUser(this.profile.username)
      .subscribe(
        (follow) => {
          this.disabledFollow = false;
          this.profile.following = follow.profile.following!;
          this.blogService.succesSwal('Succesfully','You haved unfollow this author!');

        },
        (err) => {
          console.log(err);
          this.blogService.errorSwal('Oops...','Something went wrong!');

        }
      );

    this.subscriptions.add(getUnfollowArticle);
  }

  updateArticle() {
    this.router.navigate(['../../editor/', this.article.slug]);
  }

  public deleteArticles() {
    this.blogService.questionSwal("Are you sure?\nYou won't be able to revert this!").then((result) => {
      if (result.isConfirmed) {
        this.blogService.succesSwal('Delete!','Your article has been deleted sucessfully')
        this.getAPI.onDeleteArticle(this.article?.slug).subscribe(
          (data: any) => {
            this.router.navigate(['home']);
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  public ngOnDestroy(): void {
    if(this.subscriptions && !this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
  }
}
