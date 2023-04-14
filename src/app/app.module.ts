import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { QueryComponent } from './query/query.component';
import { QueryService } from './query/query.service';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { WebsiteComponent } from './query/website/website.component';
import { TableComponent } from './query/table/table.component';
import { ResultComponent } from './query/result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    QueryComponent,
    HeaderComponent,
    DropdownDirective,
    WebsiteComponent,
    TableComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [QueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
