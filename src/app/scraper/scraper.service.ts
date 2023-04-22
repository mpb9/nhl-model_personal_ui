import { EventEmitter, Injectable } from "@angular/core";
import { PagePaths, Scraper } from "./scraper.model";
import { QueryService } from "../query/query.service";
import { Query, Website } from "../query/query.model";
import axios from "axios";

const SAVED_PAGE_PATHS = 'http://localhost/bet-nhl/bet-nhl-APIs/sql-queriers/saved_page_paths.php';

@Injectable()
export class ScraperService{
  private scrapers: Scraper[] = [];

  scrapersChanged = new EventEmitter<Scraper[]>();

  constructor(private queryService: QueryService){}

  getScrapers(){
    const queries = this.queryService.loadQueries();
    queries.forEach((query) => {
      this.scrapers.push(
        new Scraper(
          query.query_id,
          query.website,
          query.table,
          new PagePaths("", "", "")
        )
      )
    });
    this.updateScrapers();
    return this.scrapers.slice();
  }
  updateScrapers(){
    this.scrapersChanged.emit(this.scrapers);
  }

  getScraperPagePaths(query: Query){
    let paths = new PagePaths("", "", "");
    axios({
      method: "post",
      url: `${SAVED_PAGE_PATHS}`,
      headers: { "content-type": "application/json" },
      data: query
    }).then((result: any) => {
      console.log(result.data);
      if(result.data != 'none'){
        paths = new PagePaths(result.tablePath, result.tableBodyPath, result.dataPath);
        //return paths;
      }
      //return paths;
    }).catch((error: any) => console.log(error));
    setTimeout(()=>{},100);
    console.log(paths);
    return paths;
  }


}