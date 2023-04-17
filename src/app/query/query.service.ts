import { EventEmitter } from "@angular/core";
import { Column, Query, Table, Website } from "./query.model";
import axios from "axios";

const SAVED_QUERIES = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/saved_queries.php';
const SAVE_QUERY = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/create_query.php';
const DELETE_QUERY = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/delete_query.php';

export class QueryService{
  private tables: Table[] = [];
  private websites: Website[] = [];
  private queries: Query[] = [];
  public query: Query = this.getNewQuery();

  queryChanged = new EventEmitter<Query>();
  queriesChanged = new EventEmitter<Query[]>();
  tablesChanged = new EventEmitter<Table[]>();
  websitesChanged = new EventEmitter<Website[]>();

  loadQueries(){
    axios({
      method: "post",
      url: `${SAVED_QUERIES}`,
      headers: { "content-type": "application/json" }
    }).then((result) => {
      const all_saved_queries = result.data;
      all_saved_queries.forEach((saved_query: { 
                  query_id: number;
                  table: { query_id: number; table_name: string; columns: Column[]; }; 
                  website: { query_id: number; base_url: string; extensions: string[]; }; }
      ) => {
        if(saved_query.query_id >= this.queries.length){
          const newTable = new Table(saved_query.table.query_id, saved_query.table.table_name, saved_query.table.columns);
          const newWebsite = new Website(saved_query.website.query_id, saved_query.website.base_url, saved_query.website.extensions);
          this.queries.push(new Query(saved_query.query_id, newWebsite, newTable));
          this.tables.push(newTable);
          this.websites.push(newWebsite);
        }
      });
    }).catch((error) => console.log(error));
    this.updateQueries();
    return this.queries;
  }
  addQuery(){
    axios({
      method: "post",
      url: `${SAVE_QUERY}`,
      headers: { "content-type": "application/json" },
      data: this.query
    }).then(()=>{
      this.clearQueries();
    }).then(()=>{
      this.loadQueries();
    }).catch((error) => console.log(error));
  }
  deleteQuery(queryToDelete: Query){
    this.query = queryToDelete;
    axios({
      method: "post",
      url: `${DELETE_QUERY}`,
      headers: { "content-type": "application/json" },
      data: this.query
    }).then(()=>{
      this.queries = [];
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
    this.query = new Query(this.queries.length, 
                            new Website(this.queries.length, '', []), 
                            new Table(this.queries.length, '', []));
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

  updateQueries(){
    console.log(this.queries);
    this.queriesChanged.emit(this.queries.slice());
    this.tablesChanged.emit(this.tables.slice());
    this.websitesChanged.emit(this.websites.slice());
  }
  getQueries(){
    return this.queries.slice();
  }
  clearQueries(){
    this.queries = [] as Query[];
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