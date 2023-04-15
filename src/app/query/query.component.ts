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
  createQuery: boolean = true;

  constructor(private queryService: QueryService){}
  
  ngOnInit() {
    this.currentQuery = this.queryService.getQuery();
    this.queryService.queryChanged.subscribe(
      this.currentQuery = this.queryService.getQuery()
    );
    this.currentQuery = this.queryService.loadQueries();
    console.log(this.currentQuery.website.baseUrl);
    console.log(this.currentQuery.table.name);

  }

  submitQuery(){
    console.log(this.currentQuery.website.baseUrl);
    console.log(this.currentQuery.website.extensions);
    console.log(this.currentQuery.table.name);
    console.log(this.currentQuery.table.columns);

    this.queryService.addTable(this.currentQuery.table);
    this.queryService.addWebsite(this.currentQuery.website);
    this.createQuery = false;
  }

  newQuery(){
    this.currentQuery = this.queryService.getNewQuery();
    this.createQuery = true;
    console.log(this.currentQuery.website.baseUrl);
    console.log(this.currentQuery.website.extensions);
    console.log(this.currentQuery.table.name);
    console.log(this.currentQuery.table.columns);
  }

  editQuery(){
    this.currentQuery = this.queryService.getQuery();
    this.createQuery = true;
    console.log(this.currentQuery.website.baseUrl);
    console.log(this.currentQuery.website.extensions);
    console.log(this.currentQuery.table.name);
    console.log(this.currentQuery.table.columns);
  }

}
