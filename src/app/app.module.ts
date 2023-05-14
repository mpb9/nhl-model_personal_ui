import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { QueryComponent } from './query/query.component';
import { QueryService } from './query/query.service';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { WebsiteComponent } from './query/website/website.component';
import { TableComponent } from './query/table/table.component';
import { ScraperComponent } from './query/scraper/scraper.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { ScraperService } from './query/scraper/scraper.service';
import { PagePathsComponent } from './query/page-paths/page-paths.component';
import { UploadComponent } from './query/scraper/upload/upload.component';

@NgModule({
  declarations: [
    AppComponent,
    QueryComponent,
    HeaderComponent,
    DropdownDirective,
    WebsiteComponent,
    TableComponent,
    ScraperComponent,
    HomeComponent,
    PagePathsComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [QueryService, ScraperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
