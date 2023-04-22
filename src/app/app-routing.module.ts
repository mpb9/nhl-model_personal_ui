import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { QueryComponent } from "./query/query.component";
import { ManageComponent } from "./query/manage/manage.component";
import { ScraperComponent } from "./scraper/scraper.component";

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'querier', component: QueryComponent },
  { path: 'querier/manage', component: ManageComponent},
  { path: 'scraper', component: ScraperComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule{}