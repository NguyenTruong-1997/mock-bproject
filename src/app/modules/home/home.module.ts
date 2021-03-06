import { RouterModule } from '@angular/router';
import { HomeService } from './service/home.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { ArticleFeedComponent } from './components/article-feed/article-feed.component';
import { DebounceClickDirective } from '../home/directives/debounce.directive';
import {MatPaginatorModule} from '@angular/material/paginator';
import { LoadingSpinnerModule } from 'src/app/shared/components/loading-spinner/loading-spinner.module';
import { LoadingFullscreenModule} from '../../shared/components/loading-fullscreen/loading-fullscreen.module'
import { SplicePipe } from './pipe/spliceTag.pipe';
import { SummaryPipe } from './pipe/summary.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    ArticleListComponent,
    TagListComponent,
    ArticleFeedComponent,
    DebounceClickDirective,
    SummaryPipe,
    SplicePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    LoadingSpinnerModule,
    LoadingFullscreenModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ],
  providers: [HomeService],
})
export class HomeModule {}
