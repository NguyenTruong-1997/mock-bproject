import { BlogService } from 'src/app/shared/services/blog.service';
import { NgForm } from '@angular/forms';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  //#region Properties
  public subscriptions = new Subscription();

  public isLoading = false;

  @ViewChild('inpFocus') inpFocus!: ElementRef;

  //#end region

  //#region Constructor
  public constructor(
    private authService: AuthService,
    private router: Router,
    private blogService: BlogService
    ) { }

  //#end region

  //#region Methods
  public ngOnInit(): void { }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.inpFocus.nativeElement.focus();
    })
  }

  public onLogin(form: NgForm) {
    this.isLoading = true;
    const loginSub = this.authService.login(form.value)
      .subscribe(() => {
        this.isLoading = false;
        this.blogService.succesSwal('Succesful login!', 'Welcome back!');
        this.blogService.setIsLogin(true);
        this.router.navigate(['../home']);
      }, (err) => {
        this.isLoading = false;
        console.log(err);
        this.blogService.errorSwal('Oops...', 'Email or password is invalid!');
      })

    this.subscriptions.add(loginSub);
  }

  public ngOnDestroy(): void {
    if(this.subscriptions && !this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
  }

  //#end region
}
