import { Component, OnInit } from '@angular/core';
import { Query} from '../query.model';
import { QueryService } from '../query.service';
import { ScraperService } from './scraper.service';
import { RawScrape } from './scraper.model';

@Component({  
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.css'],
  providers: [ ScraperService ]
})
export class ScraperComponent implements OnInit {
  scrapers: Query[] = [];
  currentScraper!: Query;
  currentWebsites: String[] = [];
  currentRawScrape!: RawScrape;

  loading: boolean = false;
  gotScrape: boolean = true;

  constructor(private queryService: QueryService, private scraperService: ScraperService){}

  ngOnInit(){
    this.scrapers = this.queryService.loadQueries();
    this.currentScraper = this.queryService.getNewQuery();
    this.queryService.queryChanged.subscribe(() => {
      this.currentScraper = this.queryService.getQueryCopy();
      this.loadWebPages();
    });    

    this.currentRawScrape = this.scraperService.getRawScrapeCopy();
    this.scraperService.rawScrapeChanged.subscribe(() => {
      this.currentRawScrape = this.scraperService.getRawScrapeCopy();
      this.gotScrape = true;
      this.loading = false;
    });
  }

  deleteQuery(query: Query){
    this.queryService.deleteQuery(query);
  }


  newScraper(){
    this.currentScraper = this.queryService.getNewQuery();
  }

  loadScraper(query_id: number){
    this.queryService.loadQuery(query_id);
  }

  scrape(){
    this.loading = true;
    this.currentRawScrape = this.scraperService.newScrape(this.currentScraper, this.currentWebsites);
  }

  loadWebPages(){
    this.currentWebsites = [];
    const extensions = JSON.parse(JSON.stringify(this.currentScraper.website.extensions));

    if(extensions.length < 1 || extensions[0] == ''){
      this.currentWebsites.push(this.currentScraper.website.baseUrl);
      return;
    }
    let numPages = 1;

    for(let i = 0; i < extensions.length; i++){
      let num = 1; 
      if(extensions[i].includes('~num')){
        num = parseInt(extensions[i].substring(extensions[i].indexOf(' ', 5)+1)) - 
          parseInt(extensions[i].substring(5, extensions[i].indexOf(' ', 5))) + 1;
        extensions[i] = extensions[i].substring(0, extensions[i].indexOf(' ', 5));
        // ext = ~num start
      } else if (extensions[i].includes('~nloop')){
        let numLoops = parseInt(extensions[i].substring(9, extensions[i].indexOf(' ', 9)));
        let num1start = extensions[i].indexOf(' ', 9) + 1;
        let num1end = extensions[i].indexOf(' ', extensions[i].indexOf(' ', 9) + 1);
        console.log(numLoops + ', ' + num1start + ', ' + num1end);
        
        num = numLoops * (parseInt(extensions[i].substring(num1end+1)) - parseInt(extensions[i].substring(num1start, num1end)) + 1);
      } else if (extensions[i].includes('~date')){
        const firstDate: any = new Date(extensions[i].substring(6, extensions[i].indexOf(' ', 6))+'T12:00:00');
        const secondDate: any = new Date(extensions[i].substring(extensions[i].indexOf(' ', 6)+1)+'T12:00:00');
        num = Math.round(Math.abs((firstDate - secondDate) / 24 * 60 * 60 * 1000));
      }
      numPages = num > numPages ? num : numPages;
    }

    for(let j = 0; j < numPages; j++){
      let tempPage = this.currentScraper.website.baseUrl;
      for(let i = 0; i < extensions.length; i++){
        //add ~dlooop
        if(extensions[i].includes('~num')){
          tempPage += extensions[i].substring(5);
          extensions[i] = '~num ' + (parseInt(extensions[i].substring(5)) + 1);
          
        } else if (extensions[i].includes('~nloop')){
          let numLoops = parseInt(extensions[i].substring(9, extensions[i].indexOf(' ', 9)));
          let num1start = extensions[i].indexOf(' ', 9) + 1;
          let num1end = extensions[i].indexOf(' ', extensions[i].indexOf(' ', 9) + 1);

          tempPage += extensions[i].substring(num1start, num1end);

          let currNum = parseInt(extensions[i].substring(num1start, num1end)) + 1;
          if(currNum > parseInt(extensions[i].substring(num1end+1))){
            currNum = parseInt(extensions[i].substring(num1end+1)) - (numPages / numLoops);
          }
          
          extensions[i] = '~nloop ' + numLoops + ' ' + currNum + ' ' + extensions[i].substring(num1end+1);
          
        } else if (extensions[i].includes('~date')){
          // need to add re-formating if website format for data differs from yyyy-mm-dd
          tempPage += extensions[i].substring(6, extensions[i].indexOf(' ', 6));
          let firstDate: any = new Date(extensions[i].substring(6, extensions[i].indexOf(' ', 6))+'T12:00:00');
          firstDate.setDate(firstDate.getDate() + 1);
          let firstMonth = String(firstDate.getMonth()+1).length > 1 ? String(firstDate.getMonth()+1) : '0' + String(firstDate.getMonth()+1);
          let firstDay = String(firstDate.getDate()).length > 1 ? String(firstDate.getDate()) : '0' + String(firstDate.getDate());

          extensions[i] = '~date ' + firstDate.getFullYear() + '-' + firstMonth + '-' + firstDay + ' ' + extensions[i].substring(extensions[i].indexOf(' ', 6)+1);
        } else {
          tempPage += extensions[i];
        }
      }
      this.currentWebsites.push(tempPage);
      //console.log(tempPage);
    }
  }

}
