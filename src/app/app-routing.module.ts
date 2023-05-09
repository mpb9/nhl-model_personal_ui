import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { QueryComponent } from "./query/query.component";
import { ScraperComponent } from "./query/scraper/scraper.component";

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'querier', component: QueryComponent },
  { path: 'scraper', component: ScraperComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule{}