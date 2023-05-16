import { Component, Input, OnInit, Output } from '@angular/core';
import { Query, Column } from 'src/app/query/query.model';
import { RawScrape } from '../../scraper.model';

@Component({
  selector: 'app-sql-actions',
  templateUrl: './sql-actions.component.html',
  styleUrls: ['./sql-actions.component.css']
})
export class SqlActionsComponent implements OnInit{
  @Input('action-type') actionInput!: string;
  @Input('sql-columns') sqlColumnsInput!: Column[];
  @Input('raw-scraped') rawScrapeInput!: RawScrape;
  @Input('query') queryInput!: Query;
  
  query!: Query;
  action = '';
  sqlColumns!: Column[];
  rawScrape!: RawScrape;
  sqlLink = '';
  sqlResponse = '';

  sqlResponseCopied = false;

  ngOnInit(){
    this.query = this.queryInput;
    this.action = this.actionInput;
    this.sqlColumns = this.sqlColumnsInput;
    this.rawScrape = this.rawScrapeInput;
    this.sqlResponse = this.performAction();
  }

  performAction(){
    if(this.action == 'alter') return this.alterSQLTableStructure();
    if(this.action == 'initialize') return this.initializeSQLTable();
    else return '';
  }

  initializeSQLTable(){
    let createCommand = "CREATE TABLE `betting`.`" + this.query.table.name + "` (";
    this.sqlColumns.forEach((col) => {
      let colToAdd = " `" + col.name + "` " + col.type + " NOT NULL ,";
      createCommand += colToAdd;
    });
    createCommand = createCommand.slice(0,createCommand.length-1);
    createCommand = createCommand + ") ENGINE = InnoDB;";

    this.sqlLink = 'http://localhost/phpmyadmin/index.php?route=/database/sql&db=betting';
    return createCommand;
  }

  alterSQLTableStructure(){
    let createCommand = "ALTER TABLE `" + this.query.table.name + "` ";
    let lastColumnInSQL = this.query.table.columns[this.query.table.columns.length - 1].name;
  
    for(let i = 0; i < this.sqlColumns.length; i++){
      let addThisColumn = true;
      let changeThisType = false;

      this.query.table.columns.forEach((col) => {
        if(this.sqlColumns[i].name == col.name){ 
          addThisColumn = false;
          if(this.sqlColumns[i].type != col.type) changeThisType = true;
        }
      });

      if(addThisColumn){
        let colToAdd = " ADD `" + this.sqlColumns[i].name + "` " + this.sqlColumns[i].type + " NOT NULL AFTER `";
        colToAdd += lastColumnInSQL + "`,"
        createCommand += colToAdd;
        lastColumnInSQL = this.sqlColumns[i].name;
      } else if(changeThisType){
        let colToAdd = " CHANGE `" + this.sqlColumns[i].name + "` `" + this.sqlColumns[i].name + "` " + this.sqlColumns[i].type + " NOT NULL AFTER `";
        colToAdd += lastColumnInSQL + "`,"
        createCommand += colToAdd;
        lastColumnInSQL = this.sqlColumns[i].name;
      }
    }
    createCommand = createCommand.slice(0,createCommand.length-1) + ";";

    this.sqlLink = "http://localhost/phpmyadmin/index.php?route=/table/sql&db=betting&table=" + this.query.table.name;
    return createCommand;
  }

  insertSQLRows(){
    
  }

  userSQLResponse(event:any){
    if(event.target === null) return;
    this.sqlResponse = event.target.value;
    
  }
  copySQLResponse(){
    navigator.clipboard.writeText(this.sqlResponse);
    this.sqlResponseCopied = true;
  }

}
