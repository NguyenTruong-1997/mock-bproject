import { BlogService } from 'src/app/shared/services/blog.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GetUser } from 'src/app/shared/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {
  //#region Properties
  @ViewChild('inpFocus') inpFocus!: ElementRef;

  public subscriptions = new Subscription();

  public settingForm!: FormGroup;

  public isLoading = false;

  //#end region

  //#region Constructor
  public constructor(
    private authService: AuthService,
    private roter: Router,
    private formBuilder: FormBuilder,
    private blogService: BlogService
  ) { }

  //#end region

  //#region Methods
  public ngOnInit(): void {
    this.isLoading = true;
    this.settingForm = this.formBuilder.group({
      username: [
        '',
        Validators.compose([
          Validators.required
        ]),
      ],
      image: [
        '',
        Validators.compose([
        Validators.required,
        Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
        ])
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email
        ]),
      ],
      bio: [
        ''
      ],
    });
    const getUserSub = this.authService.getUser()
      .subscribe((res: GetUser) => {
        this.settingForm = this.formBuilder.group({
          username: [
            res.user.username,
            Validators.compose([
              Validators.required
            ]),
          ],
          image: [
            res.user.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg',
            Validators.compose([
            Validators.required,
            Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
            ])
          ],
          email: [
            res.user.email,
            Validators.compose([
              Validators.required,
              Validators.email
            ]),
          ],
          bio: [
            res.user.bio
          ],
        });
        this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.blogService.errorSwal('Oops...', 'Something went wrong!');
    })

    this.subscriptions.add(getUserSub);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.inpFocus.nativeElement.focus();
    })
  }

  public get handle(): { [key: string]: AbstractControl } {
    return this.settingForm.controls;
  }

  public onSetting(form: FormGroup) {
    this.blogService.questionSwal('Are you sure!?')
    .then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        const settingSub = this.authService.updateUser(form.value)
          .subscribe((res: GetUser) => {
            this.isLoading = false;
            this.blogService.succesSwal('Conglaturation!', 'Succesful update setting!')
            this.roter.navigate(['../home']);
          }, (err) => {
            this.isLoading = false;
            console.log(err);
            this.blogService.errorSwal('Oops...', 'Something went wrong!');
          })

        this.subscriptions.add(settingSub);
      }
    });
  }

  public onLogout() {
    this.blogService.questionSwal('Are you sure to logout?!')
    .then((result) => {
      if (result.isConfirmed) {
        this.blogService.succesSwal('Goodbye!', 'See youlater!')
        localStorage.removeItem('CURRENT_USER');
        this.blogService.setIsLogin(false);
        this.authService.currentUser.next(null);
        this.roter.navigate(['../home']);
      }
    });
  }

  public ngOnDestroy(): void {
    if(this.subscriptions && !this.subscriptions.closed) {
      this.subscriptions.unsubscribe();
    }
  }

  //#end region
}
