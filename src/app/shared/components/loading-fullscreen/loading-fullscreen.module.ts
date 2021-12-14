import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingFullscreenComponent } from './loading-fullscreen.component';



@NgModule({
  declarations: [LoadingFullscreenComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingFullscreenComponent
  ]
})
export class LoadingFullscreenModule { }
