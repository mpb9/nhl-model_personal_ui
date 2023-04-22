import { Component, OnInit } from '@angular/core';
import { Query } from '../query/query.model';
import { QueryService } from '../query/query.service';
/* import { Scraper } from './scraper.model';
import { ScraperService } from './scraper.service'; */

@Component({  
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.css'],
/*   providers: [ScraperService]
 */})
export class ScraperComponent implements OnInit {
  /* scrapers: Scraper[] = [];
  
  constructor(private scraperService: ScraperService){} */

  ngOnInit(){
      /* this.scrapers = this.scraperService.getScrapers();
      this.scraperService.scrapersChanged.subscribe(
        this.scrapers = this.scraperService.getScrapers()
      ); */
  }
}
