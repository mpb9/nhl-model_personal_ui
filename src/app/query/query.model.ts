export class Query{
  constructor(public query_id: number, public website: Website, public table: Table, public pagePath: PagePath){}
}

export class Table{
  constructor(public query_id: number, public name: string, public columns: Column[]){}
}

export class Column{
  constructor(public name: string, public type: string){};
}

export class Website{
  constructor(public query_id: number, public baseUrl: string, public extensions: string[]){}
}

export class PagePath{
  constructor(public query_id: number, public toAllHeaders: string, public toHeaderElement: string, public toAllData: string, public toDataElement: string, public numCols: number){}
}