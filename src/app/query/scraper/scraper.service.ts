import { EventEmitter, Injectable } from "@angular/core";
import axios from "axios";
import { Query } from "../query.model";
import { RawScrape } from "./scraper.model";
 
export class ScraperService{

  private rawScrape: RawScrape = this.getNewRawScrape();

  rawScrapeChanged = new EventEmitter<RawScrape>();

  newScrape(scraper: Query, websites: String[]){   
    const API_URL = 'http://localhost:3000/start-scraper';
    const pagePath = {
      toAllHeaders: scraper.pagePath.toAllHeaders,
      toHeaderElement: scraper.pagePath.toHeaderElement,
      toAllData: scraper.pagePath.toAllData,
      toDataElement: scraper.pagePath.toDataElement,
      numCols: scraper.pagePath.numCols
    };
    
    axios({
      method: "post",
      url: `${API_URL}`,
      headers: { "content-type": "application/json" },
      data: {
        websites,
        pagePath
      }
    }).then((result) => {
      this.rawScrape = new RawScrape(
        result.data.headers,
        result.data.body
      );
      //console.log(this.rawScrape);
      this.updateRawScrape();

    }).catch((error) => console.log(error));
    
    return this.rawScrape;
  }

  updateRawScrape(){
    this.rawScrapeChanged.emit(this.rawScrape);
  }

  getRawScrapeCopy(){
    return JSON.parse(JSON.stringify(this.rawScrape));
  }
  getNewRawScrape(){
    this.rawScrape = new RawScrape(
      [],
      []
    );
    return this.getRawScrapeCopy();
  }

}