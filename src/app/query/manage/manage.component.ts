import { Component, OnInit } from '@angular/core';
import { Query, Table, Website } from '../query.model';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  manageType: string = 'edit';
  queries: Query[] = [];

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.queries = this.queryService.loadQueries();
    this.queryService.queriesChanged.subscribe(
      (queries: Query[]) => { this.queries = queries; }
    );
  }

  manageTypeChanged(newManageType: string){
    this.manageType = newManageType;
  }

  deleteQuery(query: Query){
    this.queryService.deleteQuery(query);
  }




}
