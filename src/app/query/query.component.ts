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
  }

  submitQuery(){
    this.queryService.addQuery();
    this.createQuery = false;
  }

  newQuery(){
    this.currentQuery = this.queryService.getNewQuery();
    this.createQuery = true;
  }

  editQuery(){
    this.currentQuery = this.queryService.getQuery();
    this.createQuery = true;
  }

}
