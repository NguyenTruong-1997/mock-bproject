import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  //#region Properties

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
      iconColor: '#0f0e15',
      confirmButtonColor: '#0f0e15',
      title: `${title}`,
      text: `${text}`,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1500
    });
  }

  public errorSwal(title: string, text: string) {
    return Swal.fire({
      icon: 'error',
      iconColor: '#0f0e15',
      confirmButtonColor: '#0f0e15',
      title: `${title}`,
      text: `${text}`,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1500
    });
  }

  public questionSwal(title: string) {
     return Swal.fire({
      icon: 'question',
      iconColor: '#0f0e15',
      title: `${title}`,
      confirmButtonColor: '#0f0e15',
      showCancelButton: true,
      timerProgressBar: true,
      timer: 3000
    });
  }

  public handerError(err: any, text: string = "Oops...", title: string = 'Something went wrong!') {
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
