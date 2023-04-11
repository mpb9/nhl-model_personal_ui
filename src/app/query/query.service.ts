import { EventEmitter } from "@angular/core";
import { Query, Table, Website } from "./query.model";

export class QueryService{
  private tables: Table[] =[
    { 
      name: 'full_reg_season_stats',
      columns: [
        { name: 'year', type: 'VARCHAR(9)'}, { name: 'team', type: 'VARCHAR'},
        { name: 'gp', type: 'INT(2)'}, { name: 'record', type: 'VARCHAR(8)'},
        { name: 'pts', type: 'INT(3)'}, { name: 'w', type: 'INT(2)'},
        { name: 'l', type: 'INT(2)'}, { name: 't', type: 'INT(2)'},
        { name: 'otl', type: 'INT(2)'}, { name: 'pts_pct', type: 'FLOAT'},
        { name: 'g', type: 'INT(3)'}, { name: 'ga', type: 'INT(3)'},
        { name: 'pp_pct', type: 'FLOAT'}, { name: 'pk_pct', type: 'FLOAT'},
        { name: 's_per_gp', type: 'FLOAT'}, { name: 'sa_per_gp', type: 'FLOAT'}
      ]
    }
  ];

  private websites: Website[] = [
    {
      baseUrl: 'https://www.statmuse.com/nhl',
      extensions: [
        '/ask?q=nhl+team+records+in+the+2018%2F2019+season',
        '/ask?q=nhl+team+records+in+the+2019%2F2020+season'
      ]
    },
    {
      baseUrl: 'https://www.statmuse.com/nhl/something',
      extensions: [
        '/ask?q=nhl+team+records+in+the+2021%2F2022+season',
        '/ask?q=nhl+team+records+in+the+2020%2F2021+season'
      ]
    }
  ];

  public query: Query = {
    table: new Table('', []),
    website: new Website('', []) 
  };


  // QUERY METHODS
  queryChanged = new EventEmitter<Query>();
  updateQuery(){
    console.log("QUERY UPDATED:");
    console.log("WEBSITE: " + this.query.website.baseUrl  + ", [" + this.query.website.extensions + "]");
    console.log("TABLE: " + this.query.table.name + " , [" + this.query.table.columns + "]");
    this.queryChanged.emit(this.query);
  }
  updateQueryWebsite(website: Website){
    this.query.website = website;
    this.updateQuery();
  }
  updateQueryTable(table: Table){
    this.query.table = table;
    this.updateQuery();
  }
  getQuery(){
    return this.query;
  }

  // TABLE METHODS
  tablesChanged = new EventEmitter<Table[]>();
  updateTables(){
    this.tablesChanged.emit(this.tables.slice());
  }
  getTables(){
    return this.tables.slice();
  }
  addTable(table: Table){
    this.tables.push(table);
    this.updateTables();
  }

  // WEBSITE METHODS
  websitesChanged = new EventEmitter<Website[]>();
  updateWebsites(){
    this.websitesChanged.emit(this.websites.slice());
  }
  getWebsites(){
    return this.websites.slice();
  }
  addWebsite(website: Website){
    this.websites.push(website);
    this.updateWebsites();
  }


}