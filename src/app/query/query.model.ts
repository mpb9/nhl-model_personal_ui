export class Query{
  constructor(public website: Website, public table: Table){}
}

export class Table{
  constructor(public name: string, public columns: Column[]){}
}

export class Column{
  constructor(public name: string, public type: string){};
}

export class Website{
  constructor(public baseUrl: string, public extensions: string[]){}
}