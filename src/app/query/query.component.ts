import { Component, OnInit } from '@angular/core';
import { Query } from './query.model';
import { QueryService } from './query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css'],
  providers: [QueryService]
})
export class QueryComponent implements OnInit{
  currentQuery!: Query;
  queries: Query[] = [];
  query_id: number = -1;

  constructor(private queryService: QueryService){}
  
  ngOnInit() {
    this.currentQuery = this.queryService.getQuery();
    this.queryService.queryChanged.subscribe(
      this.currentQuery = this.queryService.getQuery()
    );
    this.queries = this.queryService.loadQueries();
    
  }

  submitQuery(){
    this.queryService.addQuery();
  }

  newQuery(){
    this.currentQuery = this.queryService.getNewQuery();
  }

  editQuery(){
    this.currentQuery = this.queryService.getQuery();
  }
  loadQuery(query: Query){
    this.queryService.updateQueryWebsite(query.website);
    this.queryService.updateQueryTable(query.table);
    this.queryService.updateQueryPagePath(query.pagePath);
  }

}
