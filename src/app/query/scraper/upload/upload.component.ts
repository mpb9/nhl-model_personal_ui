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
  @Input('queries') queriesInput!: Query[];

  rawScrape!: RawScrape;
  query!: Query;
  sqlColumns!: Column[];
  savedQueries!: Query[];

  pageNumber = 0;
  numPages = 0;
  numCols = 0;
  numRows = 0;
  allColsSame = true;

  swappingCols = [-1, -1];
  movingCol = [-1,-1];
  deletingCol = false;
  deletingRow = false;
  usingScraperColumns = false;
  usingExtraColumns = false;

  showDiagnostics: boolean = false;
  showSQLOptions: boolean = false;
  showSQLResponse: boolean = false;
  showSavedTables: boolean = false;  
  showExportOptions: boolean = false;

  sqlAction = '';
  exportAction = '';

  constructor(private queryService: QueryService, private scraperService: ScraperService){}

  ngOnInit(){
    this.savedQueries = this.queriesInput;
    this.query = this.queryService.getQueryCopy();
    this.sqlColumns = JSON.parse(JSON.stringify(this.query.table.columns));
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
      this.sqlColumns = JSON.parse(JSON.stringify(this.query.table.columns));
    }
    this.initializeDiagnostics();

    this.scraperService.rawScrapeChanged.subscribe(() => {
      this.rawScrape = this.scraperService.getRawScrapeCopy();
      this.initializeDiagnostics();
      console.log(this.rawScrape);
    });
    console.log(this.rawScrape);  
    console.log(this.savedQueries);  
  }

  initializeDiagnostics(){
    this.numPages = this.rawScrape.data.length;
    this.numCols = this.rawScrape.data[0][0].length;
    this.numRows = 0;
    this.rawScrape.data.forEach((page) => {
      this.numRows += page.length;
      if(page[page.length-1].length != this.numCols) this.allColsSame = false; 
    });
  }

// SQL RESPONSE METHODS
  openSQLResponse(){
    this.showSQLOptions = false;
    this.showSQLResponse = true;
  }
  closeSQLResponse(){
    this.showSQLOptions = false;
    this.showSQLResponse = false;
    this.sqlAction = '';
  }

// Download Methods
  exportRawScrapeAsCSV() {
    var csv = [];

    var headers = [];
    for(var i = 0; i<this.rawScrape.headers.length;i++){
      headers.push(this.rawScrape.headers[i]);
    }
    csv.push(headers.join(","));

    for(var page_id = 0; page_id < this.rawScrape.data.length; page_id++){
      for(var row_id = 0; row_id < this.rawScrape.data[page_id].length; row_id++){
        var row = [];
        for(var col_id = 0; col_id < this.rawScrape.data[page_id][row_id].length; col_id++){
          row.push(this.rawScrape.data[page_id][row_id][col_id]);
        }
        csv.push(row.join(","));
      }
    }

    this.downloadCSV(csv.join("\n"), this.query.table.name);
  }

  downloadCSV(csv: BlobPart, filename: string) {
    var csvFile;
    var downloadLink;

    if (window.Blob == undefined || window.URL == undefined || window.URL.createObjectURL == undefined) {
      alert("Your browser doesn't support Blobs");
      return;
    }

    filename += '_' + new Date().toLocaleDateString();


    csvFile = new Blob([csv], {type:"text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

// Alter Associated SQL Table Methods
  changeType(event: any, index: number){
    if(event.target === null) return;
    this.sqlColumns[index].type = event.target.value;
  }
  changeName(event: any, index: number){
    if(event.target === null) return;
    this.sqlColumns[index].name = event.target.value;
  }
  useScraperColumns(){
    this.usingScraperColumns = true;
    this.usingExtraColumns = false;

    this.sqlColumns = [];
    this.rawScrape.headers.forEach(header => {
      this.sqlColumns.push(new Column(header, ''));
    });
  }
  useSQLColumns(){
    this.usingScraperColumns = false;
    this.usingExtraColumns = false;

    this.sqlColumns = [];
    this.sqlColumns = JSON.parse(JSON.stringify(this.query.table.columns)); 
  }
  useSavedTable(index: number){
    this.usingScraperColumns = false;
    this.usingExtraColumns = false;
    this.showSavedTables = false;

    if(this.savedQueries[index] === JSON.parse(JSON.stringify(this.query))){
      this.useSQLColumns();
      return;
    }

    this.query = JSON.parse(JSON.stringify(this.savedQueries[index]));
    this.sqlColumns = [];
    this.sqlColumns = JSON.parse(JSON.stringify(this.savedQueries[index].table.columns));
  }
  addColumn(){
    this.sqlColumns.push(new Column('', ''));
  }
  addBlankColumns(){
    while(this.rawScrape.headers.length > this.sqlColumns.length){
      this.sqlColumns.push(new Column('', ''));
    }
  }


// Alter Scraped Data Table Methods
  cancelAlteration(){
    this.deletingCol = false;
    this.deletingRow = false;
    this.swappingCols = [-1,-1];
    this.movingCol = [-1,-1];
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

    if(this.movingCol[0] == 0) {
      if(this.movingCol[1] != -1){
        this.moveCol(index);
      } else {
        this.movingCol[1] = index;
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

  prep_movingCol(){
    this.movingCol[0] = 0;
  }
  moveCol(index: number){
    if(index != this.movingCol[1]){
      this.scraperService.moveColumns(this.movingCol[1], index);
    }
    this.movingCol = [-1, -1];
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

  changePage(event:any){
    if(event.target === null) return;
    this.pageNumber = Number(event.target.value)-1 > this.numPages ? this.pageNumber : Number(event.target.value)-1;
  }

}
