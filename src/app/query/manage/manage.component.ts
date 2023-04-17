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
  deleted = false;
  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.queries = this.queryService.loadQueries();
    this.queryService.queriesChanged.subscribe(
      this.queries = this.queryService.loadQueries()
    );
  }

  manageTypeChanged(newManageType: string){
    this.manageType = newManageType;
  }

  deleteQuery(query: Query){
    this.queryService.deleteQuery(query);
    this.deleted = true;
  }




}
