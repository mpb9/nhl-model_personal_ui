import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import axios from "axios";
import { Query } from "../query.model";
 
@Injectable()
export class ScraperService{
   
  constructor(private http: HttpClient) {}

  newScrape(scraper: Query, websites: String[]){   
    const API_URL = 'http://localhost:3000/start-scraper';
    const pagePath = {
      toTable: scraper.pagePath.toTable,
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
      console.log(result);
    }).catch((error) => console.log(error));

  }

}