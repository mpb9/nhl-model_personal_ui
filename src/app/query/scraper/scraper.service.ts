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
  alterScrapeTable(newTable: RawScrape){
    this.rawScrape = JSON.parse(JSON.stringify(newTable));
    this.updateRawScrape();
  }

  touchScrapeUp(){
    let i = 0;
    while(i<this.rawScrape.headers.length){
      this.rawScrape.headers[i] = JSON.parse(JSON.stringify(this.rawScrape.headers[i])).toLowerCase();
      i++;
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

  addColumn(){
    const copyOf_rawScrape = new RawScrape(
      [],
      []
    );
    
    let i = 0;
    while(i<this.rawScrape.headers.length){
        copyOf_rawScrape.headers.push(JSON.parse(JSON.stringify(this.rawScrape.headers[i])));
      i++;
    }
    copyOf_rawScrape.headers.push('NA');

    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {
        const copyOf_row = [];
        for(let i = 0; i < row.length; i++){
            copyOf_row.push(row[i]);
        }
        copyOf_row.push('NA');
        copyOf_page.push(copyOf_row);
      });
      copyOf_rawScrape.data.push(copyOf_page);
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

  moveColumns(original_id: number, new_id: number){
    const copyOf_rawScrape = new RawScrape(
      [],
      []
    );

    let header_target = new_id;
    for(let i = 0; i<header_target; i++){
      if(i != original_id){
        console.log(this.rawScrape.headers[i]);
        copyOf_rawScrape.headers.push(this.rawScrape.headers[i]);
      } else {
        header_target++;
      }
    }
    copyOf_rawScrape.headers.push(this.rawScrape.headers[original_id]);
    console.log(this.rawScrape.headers[original_id]);

    for(let i = header_target; i<this.rawScrape.headers.length; i++){
      if(i != original_id){
        console.log(this.rawScrape.headers[i]);
        copyOf_rawScrape.headers.push(this.rawScrape.headers[i]);
      }
    }


    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {
        const copyOf_row = [];
        let row_target = new_id;
        for(let k=0; k<row_target; k++){
          if(k != original_id){
            copyOf_row.push(JSON.parse(JSON.stringify(row[k])));
          } else row_target++;
        }
        copyOf_row.push(JSON.parse(JSON.stringify(row[original_id])));
        for(let k=row_target; k<row.length; k++){
          if(k != original_id){
            copyOf_row.push(JSON.parse(JSON.stringify(row[k])));
          }
        }
        copyOf_page.push(copyOf_row);                
      });
      copyOf_rawScrape.data.push(copyOf_page)
    });

    this.rawScrape = JSON.parse(JSON.stringify(copyOf_rawScrape));
    this.alterScrapeTable(this.rawScrape);
  }

  truncateColumnInputs(start_at: number, end_before: number, col_id: number){
    const copyOf_rawScrape = new RawScrape(
      JSON.parse(JSON.stringify(this.rawScrape.headers)),
      []
    );
    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {
        const copyOf_row = [];
        for(let i = 0; i < row.length; i++){
          if(i!=col_id){
            copyOf_row.push(row[i]);
          } else {
            const copyOf_Data = JSON.parse(JSON.stringify(row[i])).substring(0, start_at) + JSON.parse(JSON.stringify(row[i])).substring(end_before);
            copyOf_row.push(copyOf_Data);
          }
        }
        copyOf_page.push(copyOf_row);
      });
      copyOf_rawScrape.data.push(copyOf_page);
    });

    this.rawScrape = JSON.parse(JSON.stringify(copyOf_rawScrape));
    this.alterScrapeTable(this.rawScrape);
  }

  fillColumnInputs(col_id: number, ref_col_id: number, start_at: number, end_before: number, insert_at: number){
    const copyOf_rawScrape = new RawScrape(
      JSON.parse(JSON.stringify(this.rawScrape.headers)),
      []
    );

    console.log(insert_at)
    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {
        let copyOf_Data = '';
        const copyOf_row = [];
        for(let i = 0; i < row.length; i++){
          if(i==ref_col_id){
            copyOf_Data = JSON.parse(JSON.stringify(row[i])).substring(start_at, end_before);
          }
        }
        for(let i = 0; i < row.length; i++){
          if(i==col_id){
            if(insert_at >= 0){
              copyOf_Data = String(JSON.parse(JSON.stringify(row[i])).substring(0, insert_at))
                + String(copyOf_Data) + String(JSON.parse(JSON.stringify(row[i])).substring(insert_at));
                console.log(copyOf_Data);
            }
            copyOf_row.push(copyOf_Data);

          } else {
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

  columnValuesAreHeaders(target_col_id: number, from: number, to: number){
    const new_rawScrape = new RawScrape(
      [],
      []
    ); 

    for(let i=from; i<=to; i++){
      new_rawScrape.headers.push(JSON.parse(JSON.stringify(this.rawScrape.data[0][i][target_col_id])));
    }
    console.log(new_rawScrape.headers);
    console.log(this.rawScrape.data);

    const newNumCols = to-from+1;

    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      for(let col_id=0; col_id< page[0].length; col_id++){
        if(col_id != target_col_id){
          for(let row_id=0; row_id< page.length; row_id++){
            const new_row = [];
            const new_col_id = 0;
            while(row_id < page.length && new_col_id < newNumCols){
              console.log(page[row_id][col_id]);
              new_row.push(JSON.parse(JSON.stringify(page[row_id][col_id])));
              row_id++;
            }
            copyOf_page.push(new_row);
            row_id--;
          }
        }
      }
      new_rawScrape.data.push(copyOf_page)
    });

    this.rawScrape = JSON.parse(JSON.stringify(new_rawScrape));
    this.alterScrapeTable(this.rawScrape);
  }


  public nhlTeams = [
    "STL", "COL", "DAL", "EDM", "VAN", "CGY", "ARI", "WPG", "NSH", "DET", 
    "MIN", "CHI", "SJS", "ANA", "LAK", "BOS", "TBL", "WSH", "PIT", "PHI",
		"NYI", "CAR", "CBJ", "TOR", "NYR", "FLA", "BUF", "MTL", "NJD", "OTT",
		"VGK", "SEA"
  ];

}