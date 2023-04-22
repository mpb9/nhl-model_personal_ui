import { Website, Table } from "../query/query.model";

export class Scraper{
  constructor(public query_id: number, 
              public website: Website, 
              public table: Table, 
              public pagePaths: PagePaths){}
}

export class PagePaths{
  constructor(public tablePath: string, public tableBodyPath: string, public dataPath: string){}
}