import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { Column, Query, Table, Website } from '../query.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
  //tables!: Table[];
  queries: Query[] = [];
  @ViewChild('tableName') tableNameRef!: ElementRef;
  currentName: string = "";
  columns: Column[] = [new Column("", "")];

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.queries = this.queryService.loadQueries()
    this.queryService.queriesChanged.subscribe(
      this.queries = this.queryService.loadQueries() 
    );
    this.columns = this.queryService.getQuery().table.columns.length > 0 
                  ? this.queryService.getQuery().table.columns : [new Column("", "")];
    this.currentName = this.queryService.getQuery().table.name;
  }

  updateColumns(event: any | string, index: number, property: string){
    if(event.target === undefined){
      this.columns[index].type = event;      
    } else {
      if(property === "NAME") this.columns[index].name = event.target.value;
      if(property === "TYPE") this.columns[index].type = event.target.value;
    }

    this.updateTable();
  }

  autoCompleteColumns(table_name: string){
    let existingSearches = this.queries.filter((query) => query.table.name === table_name);

    if(existingSearches !== undefined){
      this.columns = existingSearches[0].table.columns;
    }

    this.updateTable();
  }

  updateTable(){
    this.queryService.updateQueryTable(new Table(this.queries.length, this.tableNameRef.nativeElement.value, this.columns));
  }

  moreColumnInputs(){
    this.columns.push(new Column("", ""));
  }

  clearColumnInputs(){
    this.columns = [new Column("", "")];
    this.updateTable();
  }
}
