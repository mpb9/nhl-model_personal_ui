import { Component, OnInit } from '@angular/core';
import { Query, Table, Website } from './query.model';
import { QueryService } from './query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit{
  currentQuery!: Query;


  constructor(private queryService: QueryService){}
  
  ngOnInit() {
    this.currentQuery = this.queryService.getQuery();
    this.queryService.queryChanged.subscribe(
      this.currentQuery = this.queryService.getQuery()
    );
  }

  submitQuery(){
    console.log(this.currentQuery.website.baseUrl);
    console.log(this.currentQuery.website.extensions);
    console.log(this.currentQuery.table.name);
    console.log(this.currentQuery.table.columns);

  }
}
