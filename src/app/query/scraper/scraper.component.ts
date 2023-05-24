import { Component, OnInit } from '@angular/core';
import { Query} from '../query.model';
import { QueryService } from '../query.service';
import { ScraperService } from './scraper.service';
import { RawScrape } from './scraper.model';
import axios from 'axios';

const GET_DATE_INFO = 'http://localhost/bet-apis/sql-data/get_dates.php';
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
  gotScrape: boolean = false;

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

  // need to update... also add a way to get teams for each date
  loadWebPages(){
    this.currentWebsites = [];
    const extensions: string[] = JSON.parse(JSON.stringify(this.currentScraper.website.extensions));

    if(extensions.length == 0 || extensions[0] == ''){
      this.currentWebsites.push(this.currentScraper.website.baseUrl);
      return;
    } else if(!extensions[0].includes('~') && extensions.length == 1){
      const tempBase = this.currentScraper.website.baseUrl + extensions[0];
      this.currentWebsites.push(tempBase);
      return;
    }

    const hasDate = extensions.some(function(element: string){
      return element.includes('~date')
    });
    if(hasDate){
      const minDate = extensions.reduce(function(earliest: string, current: string) {
        // Parse the date strings into Date objects
        var earliestDate = new Date(earliest.substring(6, earliest.indexOf(' ', 6)));
        var currentDate = new Date(current.substring(6, current.indexOf(' ', 6)));
        // Compare the dates
        return currentDate < earliestDate ? current.substring(6, current.indexOf(' ', 6)) : earliest.substring(6, earliest.indexOf(' ', 6));
      });
      const maxDate = extensions.reduce(function(latest: string, current: string) {
        // Parse the date strings into Date objects
        var latestDate = new Date(latest.substring(6, latest.indexOf(' ', 6)));
        var currentDate = new Date(current.substring(6, current.indexOf(' ', 6)));
        // Compare the dates
        return currentDate > latestDate ? current.substring(6, current.indexOf(' ', 6)) : latest.substring(6, latest.indexOf(' ', 6));
      });
      this.getWebPagesWithDates(extensions, minDate, maxDate);
      return;
    }

    let pages_before = [this.currentScraper.website.baseUrl];

/*     const hasTeam = extensions.some(function(element: string){
      return element.includes('~team')
    }); */
    if(extensions.some(function(element: string){ return element.includes('~team') })){
      extensions.forEach((ext) => {
        if(ext.includes('~team')){
          const teams_year = Number(ext.substring(6));
          pages_before = this.add_teams(this.year_to_activeTeams(teams_year), pages_before);
        } else {
          pages_before.forEach((pg, index) => {
            pages_before[index] = pg + ext;
          });
        }
      });
      pages_before.forEach((page: string) => {
        this.currentWebsites.push(page);
      });
      return;
    }

/*     const hasYear = extensions.some(function(element: string){
      return element.includes('~year')
    }); */
    
    if(extensions.some(function(element: string){ return element.includes('~year') })){
      // find year range in order to add appropriate # teams each year (if needed)
      let years: number[] = [];
      let teams_per_year: number[] = [];
      let pages_per_year: number[] = [];
      
      extensions.forEach((possible_year) => {
        if(possible_year.includes('~year')){
          let begin = Number(possible_year.substring(6, 10));
          if(years.length == 0 || begin > years[0]){
            years = [];
            for(begin; begin <= Number(possible_year.substring(11)); begin++) years.push(begin);
          }
        }
      });
      // years[i] = # active nhl teams in years[i]
      years.forEach((yr) => {
        teams_per_year.push(this.year_to_activeTeams(yr));
        pages_per_year.push(1);
      });

      // manipulate/add to pages_before[]
      extensions.forEach((ext) => {
        if(ext.includes('~year')){
          let pgStart = 0;
          let index = 0;
          let begin = Number(ext.substring(6, 10));
          for(begin; begin <= Number(ext.substring(11)); begin++){
            const pages_after: string[] = JSON.parse(JSON.stringify(pages_before.slice(pages_per_year[index]+pgStart)));

            const pages_with_new_years: string[] = [];
            for(let i = pgStart; i< pages_per_year[index]; i++){
              pages_with_new_years.push(String(JSON.parse(JSON.stringify(pages_before.slice(i, i+1))) + begin));
            }

            pages_before = JSON.parse(JSON.stringify(pages_before.slice(0, pgStart)));
            pages_with_new_years.forEach((new_pg) => { pages_before.push(new_pg); });
            pages_after.forEach((new_pg) => { pages_before.push(new_pg); });
            pgStart += pages_per_year[index];
            index++;
          }
          // pages_before = this.add_nums(Number(ext.substring(6, 10)), Number(ext.substring(11)), pages_before);
        } else if(ext.includes('~yteam')){    
          let pgStart = 0;
          teams_per_year.forEach((yr, index) => {
            const pages_after: string[] = JSON.parse(JSON.stringify(pages_before.slice(pages_per_year[index]+pgStart)));

            const pages_with_new_teams: string[] = [];
            for(let i = pgStart; i< pages_per_year[index]; i++){
              const new_pages_to_add = this.add_teams(yr, JSON.parse(JSON.stringify(pages_before.slice(i, i+1))));
              new_pages_to_add.forEach((new_pg) => { pages_with_new_teams.push(new_pg); });
            }

            pages_before = JSON.parse(JSON.stringify(pages_before.slice(0, pgStart)));
            pages_with_new_teams.forEach((new_pg) => { pages_before.push(new_pg); });
            pages_after.forEach((new_pg) => { pages_before.push(new_pg); });

            pgStart += pages_per_year[index];
            pages_per_year[index] *=yr;
          });

        }else {
          pages_before.forEach((pg, index) => {
            pages_before[index] = pg + ext;
          });
        }
      });

      // create currentWebsites[] from pages_before[]
      pages_before.forEach((page: string) => {
        this.currentWebsites.push(page);
      });
      return;
    }

    extensions.forEach((ext) => {
      if(ext.includes('~num')){
        pages_before = this.add_nums(
          parseInt(ext.substring(5, ext.indexOf(' ', 5))), 
          parseInt(ext.substring(ext.indexOf(' ', 5)+1)), 
          pages_before
        );
      } else {
        pages_before.forEach((pg, index) => {
          pages_before[index] = pg + ext;
        });
      }
    });
    
    pages_before.forEach((page: string) => {
      this.currentWebsites.push(page);
    });
    return;

    // OLD
    /* let numPages = 1;
    for(let i = 0; i < extensions.length; i++){
      let num = 1; 
      if(extensions[i].includes('~num')){
        num = parseInt(extensions[i].substring(extensions[i].indexOf(' ', 5)+1)) - 
          parseInt(extensions[i].substring(5, extensions[i].indexOf(' ', 5))) + 1;
        extensions[i] = extensions[i].substring(0, extensions[i].indexOf(' ', 5));

      } else if (extensions[i].includes('~date')){
        const firstDate: any = new Date(extensions[i].substring(6, extensions[i].indexOf(' ', 6))+'T12:00:00');
        const secondDate: any = new Date(extensions[i].substring(extensions[i].indexOf(' ', 6)+1)+'T12:00:00');
        num = Math.round(Math.abs((firstDate - secondDate) / 24 * 60 * 60 * 1000));
     
      } else if (extensions[i].includes('~team')){
        const year: any = Number(extensions[i].substring(7));
        num = year > 2021 ? 32 : 31;
        if(year <= 2017) num--;
      } else if (extensions[i].includes('~tovery')){
        const yearStart: any = Number(extensions[i].substring(8, 12));
        const yearEnd: any = Number(extensions[i].substring(13));

        num = 0; 
        for(let i=yearStart; i<=yearEnd; i++){
          if(i < 2017) num += 30;
          else if(i < 2022) num += 31;
          else num += 32;
        }
      }

      numPages = num > numPages ? num : numPages;
    }

    let team_index = 0;

    for(let j = 0; j < numPages; j++){
      let tempPage = this.currentScraper.website.baseUrl;
      for(let i = 0; i < extensions.length; i++){
        //add ~dloop, ~tovery
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
        } else if (extensions[i].includes('~team')){
          const year: any = Number(extensions[i].substring(7,11));
          if((team_index == 32) || (team_index == 31 && year > 2022) || (team_index == 30 && year > 2017)) team_index = 0;
          extensions[i] += this.scraperService.nhlTeams[team_index];
          team_index++;
        } else {
          tempPage += extensions[i];
        }
      }
      this.currentWebsites.push(tempPage); */
      //console.log(tempPage);
    //}
  }

  // haved added ~dnum, seems unnecessary rn
  async getWebPagesWithDates(extensions: string[], minDate: string, maxDate: string){
    let dates: string[][] = [];
    let seasons: number[][][] = [];
    let numTeams: number[][] = [];
    let numDates = 0;

    try {
      const data = await this.get_date_info(extensions);
      if (Array.isArray(data)) {
        dates = data[0];
        seasons = data[1];
        numDates = dates[0].length;
      } else throw new Error('Data is not an array.');
    } catch (error) { 
      console.error('Error finding dates:', error); 
    }
    
    let numTeamCols = 0;
    let countedTeamCols = false;

    extensions.forEach((ext) => {
      if(ext.includes('~dteam')){
        let dteam_col = [];
        for(let i=0; i<numDates; i++){
          let maxDate = new Date("1969-01-01");
          dates.forEach((date) => {
            const dateFormat = new Date(date[i]);
            maxDate = dateFormat > maxDate ? dateFormat : maxDate;
          });
          if(maxDate >= new Date("2021-10-12")){
            dteam_col.push(32);
            if(!countedTeamCols) numTeamCols += 32;
            else numTeamCols *= 32;
          } else if(maxDate >= new Date("2017-10-04")){
            dteam_col.push(31);
            if(!countedTeamCols) numTeamCols += 31;
            else numTeamCols *= 31;
          } else {
            dteam_col.push(30);
            if(!countedTeamCols) numTeamCols += 30;
            else numTeamCols *= 30;
          }
        }
        numTeams.push(dteam_col);
      }
      if(numTeamCols > 0) countedTeamCols = true;
    });

    this.currentWebsites = [];

    if(!countedTeamCols){
      for(let i=0; i<numDates; i++){
        let webPage = this.currentScraper.website.baseUrl;
        let date_ext_id = 0;
        
        for(let e=0; e<extensions.length; e++){
          if(extensions[e].includes('~date')){
            webPage += dates[date_ext_id][i];
            date_ext_id++;
          } else if(extensions[e].includes('~dyear')){
            let date_ref = Number(extensions[e].substring(7,8));
            let year1_or_2 = Number(extensions[e].substring(9));
            let season_id = i >= seasons[date_ref].length ? seasons[date_ref].length - 1 : i;
            webPage += seasons[date_ref][season_id][year1_or_2];
          } else {
            webPage += extensions[e];
          }
        }
        this.currentWebsites.push(webPage);
      }
    } else {
      for(let i=0; i<numDates; i++){
        let date_ext_id = 0;
        let withoutTeamExts = [];
        let partOfPage = this.currentScraper.website.baseUrl;
        
        for(let e=0; e<extensions.length; e++){
          if(extensions[e].includes('~date')){
            partOfPage += dates[date_ext_id][i];
            date_ext_id++;
          } else if(extensions[e].includes('~dyear')){
            let date_ref = Number(extensions[e].substring(7,8));
            let year1_or_2 = Number(extensions[e].substring(9));
            let season_id = i >= seasons[date_ref].length ? seasons[date_ref].length - 1 : i;
            partOfPage += seasons[date_ref][season_id][year1_or_2];
          } else if(extensions[e].includes('~dteam')){
            withoutTeamExts.push(partOfPage);
            partOfPage = '';
          } else {
            partOfPage += extensions[e];
          }
        }

        let pageWithTeams = this.add_dTeams(numTeams, i, withoutTeamExts);
        pageWithTeams.forEach((page: string) => {
          this.currentWebsites.push(page);
        });

      }
    }
    
  }

  get_date_info(extensions: string[]){
    let dates: string[][] = [];
    let seasons: number[][][] = [];

    extensions.forEach((ext) => {
      if(ext.includes('~date')){
        const startDate = ext.substring(6, ext.indexOf(' ', 6));
        const endDate = ext.substring(ext.indexOf(' ', 6)+1);
        axios({
          method: "post",
          url: `${GET_DATE_INFO}`,
          headers: { "content-type": "application/json" },
          data: {
            startDate,
            endDate
          }
        }).then((result) => {
          dates.push(result.data);
          let seasonRef = [];          
          for(let i = 0; i< result.data.length; i++){
            let year = Number(result.data[i].substring(0,4));
            let month = Number(result.data[i].substring(5,7));
            let day = Number(result.data[i].substring(8));
            if(month > 9 || (month == 9 && day >= 29)){
              seasonRef.push([year, year+1]);
            } else {
              seasonRef.push([year-1, year]);
            }
          }
          seasons.push(seasonRef);
        }).catch((error) => console.log(error));
      }
    });

    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        var data: [string[][], number[][][]] = [
          dates, 
          seasons
        ];
        resolve(data);
      }, 500);
    });
  }




  add_dTeams(numTeams: number[][], row_id: number, withoutTeamExts: string[]){
    let woTeamIndex = 0;
    let webpages = [withoutTeamExts[0]];

    numTeams.forEach((teamExt) => {
      webpages = this.add_teams(teamExt[row_id], JSON.parse(JSON.stringify(webpages)));

      woTeamIndex++;
      if(withoutTeamExts.length > woTeamIndex){
        for(let i = 0; i<webpages.length; i++){
          webpages[i] += withoutTeamExts[woTeamIndex];
        }
      }

    });

    return webpages;

  }

  add_teams(how_many: number, pages_before: string[]){
    let updated_pages: string[] = [];
    for(let i = 0; i < how_many; i++){
      pages_before.forEach((pg) => {
        const updated_pg = pg + this.scraperService.nhlTeams[i];
        updated_pages.push(updated_pg);
      });
    }
    return updated_pages;
  }

  year_to_activeTeams(year: number){
    if(year >= 2022) return 32;
    if(year >= 2018) return 31;
    return 30;
  }

  add_nums_loop(from: number, to: number, pages_before: string[]){
    let updated_pages: string[] = [];
    for(let i = from; i <= to; i++){
      pages_before.forEach((pg) => {
        const updated_pg = pg + i;
        updated_pages.push(updated_pg);
      });
    }
    return updated_pages;
  }

  add_nums(from: number, to: number, pages_before: string[]){
    let index = 0;
    if(pages_before.length == (to-from+1)){
      for(let i = from; i <= to; i++){
        pages_before[index] += i;
        index++;
      }
      return pages_before;
    } else {
      let updated_pages: string[] = [];
      for(let i = from; i <= to; i++){
        pages_before.forEach((pg) => {
          const updated_pg = pg + i;
          updated_pages.push(updated_pg);
        });
      }
      return updated_pages;
    }
    
  }

}
