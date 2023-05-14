import { Component, Input, OnInit } from '@angular/core';
import { QueryService } from '../../query.service';
import { ScraperService } from '../scraper.service';
import { RawScrape } from '../scraper.model';
import { Column, PagePath, Query, Table, Website } from '../../query.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input('rawScraped') rawScraped!: RawScrape;
  rawScrape!: RawScrape;
  query!: Query;

  pageNumber = 0;
  numPages = 0;
  numCols = 0;
  numRows = 0;
  allColsSame = true;

  swappingCols = [-1, -1];
  deletingCol = false;
  deletingRow = false;

  showDiagnostics: boolean = false;

  constructor(private queryService: QueryService, private scraperService: ScraperService){}

  ngOnInit(){
    this.query = this.queryService.getQueryCopy();
    this.rawScrape = this.scraperService.getRawScrapeCopy();
    if(this.rawScrape.headers.length == 0){
      this.rawScrape = new RawScrape(
        ['fakeHeader1', 'Header2', 'fakeHeader3', 'fake4', 'fakeHeader5', 'fh6'],
        [
          [
            ['p1r1d1', 'p1r1d2', 'p1r1d3', 'p1r1d4', 'p1r1d5', 'p1r1d6', 'p1r1d7'],
            ['p1r2d1', 'p1r2d2', 'p1r2d3', 'p1r2d4', 'p1r2d5', 'p1r2d6', 'p1r2d7'],
            ['p1r3d1', 'p1r3d2', 'p1r3d3', 'p1r3d4', 'p1r3d5', 'p1r3d6', 'p1r3d7'],
            ['p1r4d1', 'p1r4d2', 'p1r4d3', 'p1r4d4', 'p1r4d5', 'p1r4d6', 'p1r4d7'],
            ['p1r5d1', 'p1r5d2', 'p1r5d3', 'p1r5d4', 'p1r5d5', 'p1r5d6', 'p1r5d7'],
            ['p1r6d1', 'p1r6d2', 'p1r6d3', 'p1r6d4', 'p1r6d5', 'p1r6d6', 'p1r6d7']
          ],
          [
            ['p2r1d1', 'p2r1d2', 'p2r1d3', 'p2r1d4', 'p2r1d5', 'p2r1d6', 'p2r1d7'],
            ['p2r2d1', 'p2r2d2', 'p2r2d3', 'p2r2d4', 'p2r2d5', 'p2r2d6', 'p2r2d7']
          ],
          [
            ['p3r1d1', 'p3r1d2', 'p3r1d3', 'p3r1d4', 'p3r1d5', 'p3r1d6', 'p3r1d7'],
            ['p3r2d1', 'p3r2d2', 'p3r2d3', 'p3r2d4', 'p3r2d5', 'p3r2d6', 'p3r2d7'],
            ['p3r3d1', 'p3r3d2', 'p3r3d3', 'p3r3d4', 'p3r3d5', 'p3r3d6', 'p3r3d7']
          ]
        ]
      )
      this.query = new Query(-1,
        new Website( -1,'http://localhost/phpmyadmin/index.php', ['?route=/table/sql&','db=betting&table=query_columns']),
        new Table(-1, 'fake_table', [ 
            new Column('fakecol1', 'ftype1'),
            new Column('fakecol2', 'faket2'),
            new Column('fakecol3', 'faketype3'),
            new Column('fakecol4', 'fake4'),
            new Column('fakecol5', 'faketype5'),
            new Column('fakecol6', 'ft6')
        ]),
        new PagePath( -1, 'toAllHeaders', 'toHeaderElement', 'toAlData', 'toDataElement',7)
      );
    }
    this.initializeDiagnostics();

    this.scraperService.rawScrapeChanged.subscribe(() => {
      this.rawScrape = this.scraperService.getRawScrapeCopy();
      this.initializeDiagnostics();
      console.log(this.rawScrape);
    });
    console.log(this.rawScrape);
  }

  initializeDiagnostics(){
    this.numPages = this.rawScrape.data.length;
    this.numCols = this.rawScrape.data[0][0].length;
    this.rawScrape.data.forEach((page) => {
      this.numRows += page.length;
      if(page[page.length-1].length != this.numCols) this.allColsSame = false; 
    });
  }

  changePage(event:any){
    if(event.target === null) return;
    this.pageNumber = Number(event.target.value)-1 > this.numPages ? this.pageNumber : Number(event.target.value)-1;
  }

  cancelAlteration(){
    this.deletingCol = false;
    this.deletingRow = false;
    this.swappingCols = [-1,-1];
    this.scraperService.alterScrapeTable(this.rawScrape);
  }
  handleColumnClick(index: number){
    if(this.deletingCol) this.deleteCol(index);

    if(this.swappingCols[0] == 0) {
      if(this.swappingCols[1] != -1){
        this.swapCols(index);
      } else {
        this.swappingCols[1] = index;
      }
    }
  }
  
  prep_deletingCol(){
    this.deletingCol = true;
  }
  deleteCol(index: number){
    this.scraperService.removeColumn(index); 
    this.deletingCol = false;
  }

  prep_swappingCols(){
    this.swappingCols[0] = 0;
  }
  swapCols(index: number){
    if(index != this.swappingCols[1]){
      this.scraperService.swapColumns(this.swappingCols[1], index);
    }
    this.swappingCols = [-1, -1];
  }

  prep_deletingRow(){
    this.deletingRow = true;
  }
  handleRowClick(index: number){
    if(this.deletingRow) this.deleteRow(index);
  }
  deleteRow(index: number){
    this.scraperService.removeRow(this.pageNumber, index);
    this.deletingRow = false;
  }

}
