import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  //#region Properties
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  //#end region

  //#region Constructor
  public constructor() { }

  //#end region

  //#region Methods
  public onGetToken() {
    return JSON.parse(localStorage.getItem('CURRENT_USER')!).user.token;
  }

  public isLogin() {
    const currentUser = JSON.parse(localStorage.getItem('CURRENT_USER')!);
    if (currentUser && currentUser?.user?.token) {
      return true;
    }
    return false;
  }

  public succesSwal(title: string, text: string) {
    return Swal.fire({
      icon: 'success',
      position: 'top-end',
      iconColor: '#0f0e15',
      confirmButtonColor: '#0f0e15',
      title: `${title}`,
      text: `${text}`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  public errorSwal(title: string, text: string) {
    return Swal.fire({
      icon: 'error',
      position: 'top-end',
      iconColor: '#0f0e15',
      confirmButtonColor: '#0f0e15',
      title: `${title}`,
      text: `${text}`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  public questionSwal(title: string) {
     return Swal.fire({
      icon: 'question',
      iconColor: '#0f0e15',
      title: `${title}`,
      confirmButtonColor: '#0f0e15',
      showCancelButton: true
    });
  }

  public setIsLogin(status: boolean) {
    this.isAuthenticatedSubject.next(status);
  }

  public handerError(err: any, text:string="Opps...", title:string='Something went wrong!') {
    if (err.error instanceof Error) {
      console.log(`'An error occurred:', ${err.error.message}`);
    } else {
      console.log(
        `Backend returned code ${err.status}, body was: ${err.error}`
      );
    }
   this.errorSwal(title,text);
  }

  //#end region
}
