import { Query } from "../query.model";

export class Scraper{
  constructor(public query: Query, public sqlCommands: string[]){}
}
