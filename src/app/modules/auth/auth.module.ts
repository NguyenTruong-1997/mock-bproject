import { CandeactiveService } from './../../shared/services/candeactive.service';
import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';

import { SettingService } from './service/setting.service';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SettingComponent } from './components/setting/setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingSpinnerModule } from 'src/app/shared/components/loading-spinner/loading-spinner.module';
import { LoadingFullscreenModule } from 'src/app/shared/components/loading-fullscreen/loading-fullscreen.module';



@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent,
    SettingComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingSpinnerModule,
    LoadingFullscreenModule
  ],
  providers: [SettingService, CandeactiveService]
})
export class AuthModule { }
