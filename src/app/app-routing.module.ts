import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { QueryComponent } from "./query/query.component";
import { ManageComponent } from "./query/manage/manage.component";

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'querier', component: QueryComponent },
  { path: 'querier/manage', component: ManageComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule{}