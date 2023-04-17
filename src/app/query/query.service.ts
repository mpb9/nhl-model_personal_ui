import { EventEmitter } from "@angular/core";
import { Column, Query, Table, Website } from "./query.model";
import axios from "axios";

const MY_QUERIES = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/saved_queries.php';
const SAVE_QUERY = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/create_query.php';

export class QueryService{
  private tables: Table[] = [];

  private websites: Website[] = [];

  public query: Query = {
    table: new Table('', []),
    website: new Website('', []) 
  };

  queryChanged = new EventEmitter<Query>();
  tablesChanged = new EventEmitter<Table[]>();
  websitesChanged = new EventEmitter<Website[]>();

  loadQueries(){
    axios({
      method: "post",
      url: `${MY_QUERIES}`,
      headers: { "content-type": "application/json" }
    }).then((result) => {
      const all_saved_queries = result.data;
      console.log(all_saved_queries);
      all_saved_queries.forEach((saved_query: { table: { table_name: string; columns: Column[]; }; website: { base_url: string; extensions: string[]; }; }) => {
        this.tables.push( new Table(saved_query.table.table_name, saved_query.table.columns) );
        this.updateTables();
        this.websites.push( new Website(saved_query.website.base_url, saved_query.website.extensions) );
        this.updateWebsites();
      });
    }).catch((error) => console.log(error));
    return this.getQuery();
  }
  addQuery(){
    axios({
      method: "post",
      url: `${SAVE_QUERY}`,
      headers: { "content-type": "application/json" },
      data: this.query
    }).then(()=>{
      this.loadQueries();
    }).catch((error) => console.log(error));
  }
  updateQuery(){
    //this.printQuery();
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
  getNewQuery(){
    this.query = {
      table: new Table('', []),
      website: new Website('', []) 
    };
    return this.getQuery();
  }
  printQuery(){
    console.log("___QUERY___");
    console.log("WEBSITE: " + this.query.website.baseUrl);
    console.log("  extensions: [");
    this.query.website.extensions.forEach(ext => console.log("   " + ext));
    console.log("  ]");
    console.log("TABLE: " + this.query.table.name);
    console.log("  columns: [");
    this.query.table.columns.forEach(col => console.log("   [name: " + col.name + ", type: " + col.type + "]"));
    console.log("  ]");
    console.log("");
  }

  // TABLE METHODS
  updateTables(){
    this.tablesChanged.emit(this.tables.slice());
  }
  getTables(){
    return this.tables.slice();
  }

  // WEBSITE METHODS
  updateWebsites(){
    this.websitesChanged.emit(this.websites.slice());
  }
  getWebsites(){
    return this.websites.slice();
  }

}