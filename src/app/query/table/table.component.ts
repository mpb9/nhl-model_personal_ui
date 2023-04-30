import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { Column, Query, Table } from '../query.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
  @ViewChild('tableName') tableNameRef!: ElementRef;
  currentTable: Table = new Table(-1, "", [new Column("", "")]);
  currentName: string = "";
  columns: Column[] = [new Column("", "")];

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.queryService.queryChanged.subscribe(() => {
      this.currentTable = this.queryService.getQueryCopy().table;
      this.columns = this.currentTable.columns.length > 0 ? this.currentTable.columns : [new Column("", "")];
      this.currentName = this.currentTable.name;
    });
    
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

  updateTable(){
    this.queryService.updateQueryTable(new Table(this.currentTable.query_id, this.tableNameRef.nativeElement.value, this.columns));
  }

  moreColumnInputs(){
    this.columns.push(new Column("", ""));
  }

  clearCurrent(){
    this.columns = [new Column("", "")];
    this.currentName = "";
    this.queryService.updateQueryTable(new Table(this.currentTable.query_id, this.currentName, this.columns));
  }
}
