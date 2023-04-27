import { Component, OnInit } from '@angular/core';
import { Query } from './query.model';
import { QueryService } from './query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css'],
  providers: [ QueryService ]
})
export class QueryComponent implements OnInit{
  currentQuery!: Query;
  queries: Query[] = [];

  constructor(private queryService: QueryService){}
  
  ngOnInit() {
    this.queries = this.queryService.loadQueries();
    this.currentQuery = this.queryService.getQueryCopy();
    this.queryService.queryChanged.subscribe(
      this.currentQuery = this.queryService.getQueryCopy()
    );    
  }

  submitQuery(){
    this.queryService.addQuery();
  }

  newQuery(){
    this.currentQuery = this.queryService.getNewQuery();
  }

  editQuery(){
    this.currentQuery = this.queryService.getQueryCopy();
  }
  loadQuery(query_id: number){
    this.queryService.loadQuery(query_id);
  }

}
