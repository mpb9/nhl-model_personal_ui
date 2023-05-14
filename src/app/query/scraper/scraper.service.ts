import { EventEmitter, Injectable } from "@angular/core";
import axios from "axios";
import { Query } from "../query.model";
import { RawScrape } from "./scraper.model";
 
@Injectable()
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
      this.touchScrapeUp();

    }).then(() => {
      this.updateRawScrape();

    }).catch((error) => console.log(error));

    return this.rawScrape;
  }

  updateRawScrape(){
    this.rawScrapeChanged.emit(this.getRawScrapeCopy());
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

  touchScrapeUp(){
    let i = 0;
    while(i<this.rawScrape.headers.length){
      this.rawScrape.headers[i] = JSON.parse(JSON.stringify(this.rawScrape.headers[i])).toLowerCase();
      i++;
      console.log(this.rawScrape.headers[i-1]);
    }
    
    this.tryFixingColMismatch();
    this.alterScrapeTable(this.rawScrape);
    return this.rawScrape;
  }

  tryFixingColMismatch(){
    const header_length = this.rawScrape.headers.length;
    const row_length = this.rawScrape.data[0][0].length;

    const diff = row_length - header_length;

    if(diff > 0){
      const regex = /[^a-zA-Z\-]/; // Matches all non-aphabetical characters or dashes

      if((
          this.rawScrape.headers[0].includes('name') || this.rawScrape.headers[0].includes('player') ||
          this.rawScrape.headers[0].includes('team') || this.rawScrape.headers[0].includes('line')
        ) && (
          regex.test(this.rawScrape.data[0][0][0]) 
        )
      ){
        const copyOf_rawScrape = new RawScrape(
          JSON.parse(JSON.stringify(this.rawScrape.headers)),
          []
        );
    
        this.rawScrape.data.forEach((page) => {
          const copyOf_page: string[][] = [];
          page.forEach((row) => {
            const copyOf_row = [];
            for(let i = 1; i < row.length; i++){
              copyOf_row.push(row[i]);
            }
            copyOf_page.push(copyOf_row);
          });
          copyOf_rawScrape.data.push(copyOf_page);
        });
        console.log(copyOf_rawScrape)
        this.rawScrape = JSON.parse(JSON.stringify(copyOf_rawScrape));
      } else {
        for(let i = 0; i < diff; i++){
          this.rawScrape.headers.push(' ');
        }
      }
    } 
  }

  removeRow(page_id: number, row_id: number){
    const copyOf_rawScrape = new RawScrape(
      JSON.parse(JSON.stringify(this.rawScrape.headers)),
      []
    );
    
    let curr_page = 0;
    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      for(let i = 0; i < page.length; i++){
        if(!(i == row_id && curr_page == page_id)) copyOf_page.push(page[i]);
      }
      copyOf_rawScrape.data.push(copyOf_page);
      curr_page++;
    });

    this.rawScrape = JSON.parse(JSON.stringify(copyOf_rawScrape));
    this.alterScrapeTable(this.rawScrape);
  }

  removeColumn(index: number){
    const copyOf_rawScrape = new RawScrape(
      [],
      []
    );
    
    let i = 0;
    while(i<this.rawScrape.headers.length){
      if(i != index){
        copyOf_rawScrape.headers.push(JSON.parse(JSON.stringify(this.rawScrape.headers[i])));
      }
      i++;
    }

    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {
        const copyOf_row = [];
        for(let i = 0; i < row.length; i++){
          if(i!=index){
            copyOf_row.push(row[i]);
          }
        }
        copyOf_page.push(copyOf_row);
      });
      copyOf_rawScrape.data.push(copyOf_page);
    });

    this.rawScrape = JSON.parse(JSON.stringify(copyOf_rawScrape));
    this.alterScrapeTable(this.rawScrape);
  }

  swapColumns(id_1: number, id_2: number){
    const temp_header = JSON.parse(JSON.stringify(this.rawScrape.headers[id_1]));
    this.rawScrape.headers[id_1] =  JSON.parse(JSON.stringify(this.rawScrape.headers[id_2]));
    this.rawScrape.headers[id_2] =  JSON.parse(JSON.stringify(temp_header));

    const copyOf_rawScrape = new RawScrape(
      JSON.parse(JSON.stringify(this.rawScrape.headers)),
      []
    );

    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {
        const copyOf_row = JSON.parse(JSON.stringify(row));
        const temp_data = JSON.parse(JSON.stringify(copyOf_row[id_1]));
        copyOf_row[id_1] =  JSON.parse(JSON.stringify(copyOf_row[id_2]));
        copyOf_row[id_2] =  JSON.parse(JSON.stringify(temp_data));
        copyOf_page.push(copyOf_row);                
      });
      copyOf_rawScrape.data.push(copyOf_page)
    });

    this.rawScrape = JSON.parse(JSON.stringify(copyOf_rawScrape));
    this.alterScrapeTable(this.rawScrape);
  }

  alterScrapeTable(newTable: RawScrape){
    this.rawScrape = JSON.parse(JSON.stringify(newTable));
    this.updateRawScrape();
  }

}