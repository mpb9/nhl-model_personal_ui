export class Query{
  constructor(public query_id: number, public website: Website, public table: Table){}
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