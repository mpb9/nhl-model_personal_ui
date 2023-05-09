import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Scraper } from "./scraper.model";
import { QueryService } from "../query.service";
import { PagePath, Query, Table, Website } from "../query.model";
import axios from "axios";
 
const SCRAPE_WEB = 'http://localhost/bet-nhl/bet-nhl-APIs/web-scrapers/webScrapeExample/index.js';
@Injectable()
export class ScraperService{
   
  constructor(private http: HttpClient) {}

  newScrape(){
    /* axios({
      method: "post",
      url: `${SCRAPE_WEB}`,
      headers: { "content-type": "application/json" }
    }).then(()=>{
    }).catch((error) => console.log(error)); */
  }

}