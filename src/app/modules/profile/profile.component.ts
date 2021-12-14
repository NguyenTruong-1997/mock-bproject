import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from 'src/app/shared/models/profile.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConnectApiService } from '../../shared/services/connect-api.service';
import { GetUser } from '../../shared/models/user.model';
import { ProfileService } from './service/profile.service';
import { mergeMap, switchMap } from 'rxjs/operators';
import { GetProfile } from '../../shared/models/profile.model';
import Swal from 'sweetalert2';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  //#region Properties
  userProfile!: any;
  user!: any;
  username?: string;
  param?: any;
  follow!: boolean;
  isLoading: boolean = false;
  //#end region

  //#region Constructor
  public constructor(
    private userService: ConnectApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private blogService: BlogService,
    private router: Router
  ) { }

  //#end region

  //#region Methods
  public ngOnInit(): void {
    this.isLoading = true;
    this.authService.currentUser.subscribe((user) => {
      this.userProfile = user?.user;
      this.username = user?.user.username;
    });

    this.route.params.pipe(mergeMap((params): any => {
      this.profileService.currentArticles.next(params.username);
      return this.userService.onGetProfile(params.username)
    })
    ).subscribe((user: any) => {
      this.user = user;
      this.follow = user.profile.following;
      this.isLoading = false;
    },
      error => {
        this.blogService.handerError(error);
        this.isLoading = false;
        this.router.navigate(['page-not-found']);

      })
  }
  links = [
    { url: `./`, label: 'My Articles' },
    { url: `./favorites`, label: 'Favorited Articles' },
  ];

  onFollowUser() {
    if (this.blogService.isLogin()) {
      this.userService.onFollowUser(this.user.profile.username).subscribe(follow =>
        this.follow = follow.profile.following);
      this.blogService.succesSwal('success', `Follow ${this.user.profile.username} successfully!`)
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
  onUnfollowUser() {

    this.userService.onUnfollowUser(this.user.profile.username).subscribe(unfollow =>
      this.follow = unfollow.profile.following);
    this.blogService.succesSwal('success', `Unfollow ${this.user.profile.username} successfully!`)

  }

}
