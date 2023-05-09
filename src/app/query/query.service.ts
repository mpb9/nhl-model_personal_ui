import { EventEmitter } from "@angular/core";
import { Column, PagePath, Query, Table, Website } from "./query.model";
import axios from "axios";

const SAVED_QUERIES = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/saved_queries.php';
const CREATE_QUERY = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/create_query.php';
const DELETE_QUERY = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/delete_query.php';

export class QueryService{
  private tables: Table[] = [];
  private websites: Website[] = [];
  private queries: Query[] = [];
  private pagePaths: PagePath[] = [];
  private query: Query = this.getNewQuery();
  private newQueryId: number = 0;

  queryChanged = new EventEmitter<Query>();
  queriesChanged = new EventEmitter<Query[]>();

  // QUERIES Methods
  loadQueries(){
    this.clearQueries();
    this.newQueryId = 0;

    axios({
      method: "post",
      url: `${SAVED_QUERIES}`,
      headers: { "content-type": "application/json" }
      
    }).then((result) => {
      result.data.forEach(
        (saved_query: { 
            query_id: number;
            table: { query_id: number; table_name: string; columns: Column[]; }; 
            website: { query_id: number; base_url: string; extensions: string[]; }; 
            page_path: { query_id: number; to_table: string; to_all_data: string; to_data_element: string; };
        }) => {
            const newTable = new Table(saved_query.table.query_id, saved_query.table.table_name, saved_query.table.columns);
            const newWebsite = new Website(saved_query.website.query_id, saved_query.website.base_url, saved_query.website.extensions);
            const newPagePath = new PagePath(saved_query.query_id, saved_query.page_path.to_table, saved_query.page_path.to_all_data, saved_query.page_path.to_data_element);
            this.queries.push(new Query(saved_query.query_id, newWebsite, newTable, newPagePath));
            this.tables.push(newTable);
            this.websites.push(newWebsite);
            this.pagePaths.push(newPagePath);
            this.newQueryId = saved_query.query_id >= this.newQueryId ? saved_query.query_id + 1 : this.newQueryId;
        }
      );
    }).catch((error) => console.log(error));

    this.updateQueries();
    return this.queries;  // can't use .slice() bc returns 0 queries (?)
  }
  updateQueries(){
    this.queriesChanged.emit(this.queries.slice());
    console.log('QUERIES UPDATED');
  }
  clearQueries(){
    this.queries = [] as Query[];
  }

  // QUERY Methods
  addQuery(){
    if(this.query.query_id == this.newQueryId){
      axios({
        method: "post",
        url: `${CREATE_QUERY}`,
        headers: { "content-type": "application/json" },
        data: this.query
      }).then(()=>{
        this.clearQueries();
      }).then(()=>{
        this.loadQueries();
      }).catch((error) => console.log(error));
    } else {
      console.log('Query ID already in database');
    }
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
      this.query = this.getNewQuery();
    }).then(()=>{
      this.loadQueries();
    }).catch((error) => console.log(error));
  }
  updateQuery(){
    console.log("CURRENT QUERY ID: " + this.query.query_id);
    this.queryChanged.emit(this.query);
  }
  updateQueryWebsite(website: Website){
    if(website.query_id != this.newQueryId){
      this.query = new Query(
        this.newQueryId, 
        new Website(this.newQueryId, website.baseUrl, website.extensions),
        new Table(this.newQueryId, this.query.table.name, this.query.table.columns), 
        new PagePath(this.newQueryId, this.query.pagePath.toTable, this.query.pagePath.toAllData, this.query.pagePath.toDataElement)
      );
    } else {
      this.query.website = website;
    }
  
    this.updateQuery();
  }
  updateQueryTable(table: Table){
    if(table.query_id != this.newQueryId){
      this.query = new Query(
        this.newQueryId, 
        new Website(this.newQueryId, this.query.website.baseUrl, this.query.website.extensions),
        new Table(this.newQueryId, table.name, table.columns), 
        new PagePath(this.newQueryId, this.query.pagePath.toTable, this.query.pagePath.toAllData, this.query.pagePath.toDataElement)
      );
    } else {
      this.query.table = table;
    }
    this.updateQuery();
  }
  updateQueryPagePath(pagePath: PagePath){
    if(pagePath.query_id != this.newQueryId){
      this.query = new Query(
        this.newQueryId, 
        new Website(this.newQueryId, this.query.website.baseUrl, this.query.website.extensions),
        new Table(this.newQueryId, this.query.table.name, this.query.table.columns), 
        new PagePath(this.newQueryId, pagePath.toTable, pagePath.toAllData, pagePath.toDataElement)
      );
    } else {
      this.query.pagePath = pagePath;
    }
    this.updateQuery();
  }
  loadQuery(query_id: number){
    const tempQuery = this.queries.slice().find(q => q.query_id === query_id);
    if(tempQuery){
      this.query = tempQuery;
      this.queryChanged.emit(this.query);
    }
  }
  getQueryCopy(){
    return JSON.parse(JSON.stringify(this.query));
  }
  getNewQuery(){
    this.query = new Query(
      this.newQueryId, 
      new Website(this.newQueryId, '', []), 
      new Table(this.newQueryId, '', []),
      new PagePath(this.newQueryId, '', '', '')
    );
    return this.getQueryCopy();
  }

}