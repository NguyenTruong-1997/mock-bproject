import { User } from './../../shared/models/user.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GetUser } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BlogService } from 'src/app/shared/services/blog.service';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  //#region Properties
  public subscriptions = new Subscription();

  public isLogin: boolean = false;

  public currenUser!: User | undefined;

  //#end region

  //#region Constructor
  public constructor(
    private authService: AuthService,
    private blogService: BlogService
  ) { }

  //#end region

  //#region Methods
  public ngOnInit(): void {
    const currentUserSub = this.authService.currentUser.subscribe((user: GetUser | null) => {
      this.isLogin = !user ? false : true;
      // if(user?.user.image !== user?.user.bio) {
        this.currenUser = user?.user;
      // }
    })

    // if(this.blogService.isLogin()) {
    //   const getUserSub = this.authService.getUser().subscribe((user: GetUser) => {
    //     this.currenUser = user.user;
    //   }, (err) => {
    //     console.log(err);
    //   })

    //   this.subscriptions.add(getUserSub);
    // }

    // const isLoginSub = this.blogService.isAuthenticated.pipe(
    //   filter(res => res),
    //   switchMap((res: boolean) => {
    //     return this.authService.getUser()
    //   })
    // )
    // .subscribe((user: GetUser) => {
    //   this.currenUser = user.user;
    // })

    // this.subscriptions.add(isLoginSub)

    this.subscriptions.add(currentUserSub);
  }

  public ngOnDestroy(): void {
    if(this.subscriptions && !this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
  }

  //#end region
}
