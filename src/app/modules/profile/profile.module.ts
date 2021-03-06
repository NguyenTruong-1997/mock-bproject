import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileService } from './service/profile.service';
import { ProfileComponent } from './profile.component';
import { ProfileFavoritesComponent } from './components/profile-favorites/profile-favorites.component';
import { ProfileArticleComponent } from './components/profile-article/profile-article.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConnectApiService } from 'src/app/shared/services/connect-api.service';
import { LoadingSpinnerModule } from 'src/app/shared/components/loading-spinner/loading-spinner.module';
import { DebounceDirective } from './DebounceDirective/debounce.directive';
import { SummaryPipe } from '../profile/pipe/summary.pipe'
import { LoadingFullscreenModule } from 'src/app/shared/components/loading-fullscreen/loading-fullscreen.module';
import { SplicePipe } from './pipe/spliceTag.pipe';
@NgModule({
  declarations: [
    ProfileComponent,
    ProfileArticleComponent,
    ProfileFavoritesComponent,
    DebounceDirective,
    SummaryPipe,
    SplicePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatPaginatorModule,
    LoadingFullscreenModule,
    LoadingSpinnerModule,
    RouterModule.forChild([
      {
        path: ':username',
        component: ProfileComponent,
        children: [
          { path: '', component: ProfileArticleComponent },
          { path: 'favorites', component: ProfileFavoritesComponent },
        ],
      },
    ]),
  ],
  providers: [ProfileService, ConnectApiService],
})
export class ProfileModule { }
