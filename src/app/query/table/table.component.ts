import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { Column, Table, Website } from '../query.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
  tables!: Table[];
  @ViewChild('tableName') tableNameRef!: ElementRef;
  columns: Column[] = [new Column("", "")];

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.tables = this.queryService.getTables();
    this.queryService.tablesChanged.subscribe(
      (tables: Table[]) => {
        this.tables = tables;
      }
    );
  }

  updateColumns(value: string, index: number, property: string){
    if(index === this.columns.length){
      if(property === "NAME") this.columns.push(new Column(value, ""));
      if(property === "TYPE") this.columns.push(new Column("", value));
    } else {
      if(index > this.columns.length) console.log("INDEX > COL LENGTH");
      if(property === "NAME") this.columns[index].name = value;
      if(property === "TYPE") this.columns[index].type = value;
    }
    this.updateTable();
  }

  autoCompleteColumns(table_name: string){
    let existingSearches = this.tables.filter((table) => table.name === table_name);

    if(existingSearches !== undefined){
      this.columns = existingSearches[0].columns;
    }

    this.updateTable();
  }

  updateTable(){
    let tableSelected = new Table(this.tableNameRef.nativeElement.value, this.columns);
    this.queryService.updateQueryTable(tableSelected);
  }

  moreColumnInputs(){
    this.columns.push(new Column("", ""));
  }

}
