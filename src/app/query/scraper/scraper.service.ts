import { EventEmitter, Injectable } from "@angular/core";
import { Scraper } from "./scraper.model";
import { QueryService } from "../query.service";
import { PagePath, Query, Table, Website } from "../query.model";
import axios from "axios";

@Injectable()
export class ScraperService{
  private scrapers: Scraper[] = [];
  private scraper: Scraper = this.getNewScraper();

  scrapersChanged = new EventEmitter<Scraper[]>();

  constructor(private queryService: QueryService){}

  loadScrapers(){
    const queries = this.queryService.loadQueries();
    queries.forEach((query) => {
      this.scrapers.push(
        new Scraper(
          query,
          []
        )
      )
    });
    this.updateScrapers();
    return this.scrapers;
  }
  updateScrapers(){
    this.scrapersChanged.emit(this.scrapers);
  }

  getScraperCopy(){
    return JSON.parse(JSON.stringify(this.scraper));;
  }

  getNewScraper(){
    this.scraper = new Scraper(
      new Query(
        -1, 
        new Website(-1, '', []), 
        new Table(-1, '', []),
        new PagePath(-1, '', '', '')
      ),
      []
    );
    return this.getScraperCopy();
  }


}