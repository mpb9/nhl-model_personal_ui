import { EventEmitter } from "@angular/core";
import { Column, PagePath, Query, Table, Website } from "./query.model";
import axios from "axios";

const SAVED_QUERIES = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/saved_queries.php';
const SAVE_QUERY = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/create_query.php';
const DELETE_QUERY = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/delete_query.php';

export class QueryService{
  private tables: Table[] = [];
  private websites: Website[] = [];
  private queries: Query[] = [];
  private pagePaths: PagePath[] = [];
  public query: Query = this.getNewQuery();

  queryChanged = new EventEmitter<Query>();
  queriesChanged = new EventEmitter<Query[]>();
  tablesChanged = new EventEmitter<Table[]>();
  websitesChanged = new EventEmitter<Website[]>();
  pagePathsChanged = new EventEmitter<PagePath[]>();

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
                  website: { query_id: number; base_url: string; extensions: string[]; }; 
                  page_path: { query_id: number; to_table: string; to_all_data: string; to_data_element: string; };
                }
      ) => {
        if(saved_query.query_id >= this.queries.length){
          const newTable = new Table(saved_query.table.query_id, saved_query.table.table_name, saved_query.table.columns);
          const newWebsite = new Website(saved_query.website.query_id, saved_query.website.base_url, saved_query.website.extensions);
          const newPagePath = new PagePath(saved_query.query_id, saved_query.page_path.to_table, saved_query.page_path.to_all_data, saved_query.page_path.to_data_element);
          this.queries.push(new Query(saved_query.query_id, newWebsite, newTable, newPagePath));
          this.tables.push(newTable);
          this.websites.push(newWebsite);
          this.pagePaths.push(newPagePath);
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
      this.clearQueries();
    }).then(()=>{
      this.loadQueries();
    }).catch((error) => console.log(error));
  }

  updateQuery(){
    this.queryChanged.emit(this.query);
    console.log(this.query)
  }
  updateQueryWebsite(website: Website){
    this.query.website = website;
    this.query.query_id = website.query_id;
    this.updateQuery();
  }
  updateQueryTable(table: Table){
    this.query.table = table;
    this.query.query_id =table.query_id;
    this.updateQuery();
  }
  updateQueryPagePath(pagePath: PagePath){
    this.query.pagePath = pagePath;
    this.query.query_id = pagePath.query_id;
    this.updateQuery();
  }
  getQuery(){
    return this.query;
  }
  getNewQuery(){
    this.query = new Query(this.queries.length, 
                            new Website(this.queries.length, '', []), 
                            new Table(this.queries.length, '', []),
                            new PagePath(this.queries.length, '', '', ''));
    return this.getQuery();
  }

  updateQueries(){
    console.log(this.queries);
    this.queriesChanged.emit(this.queries.slice());
    this.tablesChanged.emit(this.tables.slice());
    this.websitesChanged.emit(this.websites.slice());
    this.pagePathsChanged.emit(this.pagePaths.slice());
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

  updatePagePaths(){
    console.log(this.query.pagePath);
    this.pagePathsChanged.emit(this.pagePaths.slice());
  }
  getPagePaths(){
    return this.pagePaths.slice();
  }
  getPagePath(query_id: number){
    return this.pagePaths[query_id];
  }

}