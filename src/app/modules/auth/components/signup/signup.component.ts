import { BlogService } from 'src/app/shared/services/blog.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
  //#region Properties
  @ViewChild('inpFocus') inpFocus!: ElementRef;
  public subscriptions = new Subscription();

  public isLoading = false;

  //#end region

  //#region Constructor
  public constructor(
    private authService: AuthService,
    private roter: Router,
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

  public onSignup(form: NgForm) {
    this.isLoading = true;
    const signupSub = this.authService.registration(form.value)
      .subscribe(() => {
        this.isLoading = false;
        this.blogService.succesSwal('Conglaturation!', 'Succesful register!')
        this.roter.navigate(['../auth/login']);
      }, (err) => {
        this.isLoading = false;
        console.log(err);
        this.blogService.errorSwal('Oops...', 'Something went wrong! Maybe your email has already been taken!')
      })

    this.subscriptions.add(signupSub);
  }

  public ngOnDestroy(): void {
    if(this.subscriptions && !this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
  }

  //#end region
}
