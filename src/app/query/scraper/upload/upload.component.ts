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

  usingScraperColumns = false;
  usingExtraColumns = false;

  swappingCols = [-1, -1];
  movingCol = [-1,-1];
  deletingCol = false;
  deletingRow = false;

  fillingCol = [-1, -1, -1];
  fillingColInput = ['', ''];
  fillingNotAdding = true;
  addingIndex = -1;

  alteringCells = false;
  alterCellInput = ['', ''];

  truncatingCol = [-1, -1];
  truncateColInput = ['', ''];

  columnIsHeaders = [-1,-1];
  newHeaderIds = ['',''];

  addingPerPageVariable = false;
  perPageVariables = ['','',''];


  showDiagnostics: boolean = false;
  showSQLOptions: boolean = false;
  showSQLResponse: boolean = false;
  showExportOptions: boolean = false;

  showSavedTables: boolean = false;
  showScrapedColOptions: boolean = false; 

  sqlAction = '';
  exportAction = '';

  constructor(private queryService: QueryService, private scraperService: ScraperService){}

  ngOnInit(){
    this.savedQueries = this.queriesInput;
    this.query = this.queryService.getQueryCopy();
    this.sqlColumns = JSON.parse(JSON.stringify(this.query.table.columns));
    this.rawScrape = this.scraperService.getRawScrapeCopy();
  
    this.scraperService.rawScrapeChanged.subscribe(() => {
      this.rawScrape = this.scraperService.getRawScrapeCopy();
      this.initializeDiagnostics();
      console.log(this.rawScrape);
    });

    if(this.rawScrape.headers.length == 0){
      this.rawScrape = new RawScrape(
        ['fakeHeader1', 'Header2', 'fakeHeader3', 'fake4', 'fakeHeader5', 'fh6', '7'],
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
        new PagePath( -1, 'toAllHeaders', 'toHeaderElement', 'toAlData', 'toDataElement',7, [])
      );
      this.sqlColumns = JSON.parse(JSON.stringify(this.query.table.columns));
      this.scraperService.alterScrapeTable(this.rawScrape);
    }
    this.initializeDiagnostics();

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
// ADD A SAVE TABLE METHOD
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
  changeScrapeHeader(event: any, index: number){ //Sometimes changes multiple (if same?)
    if(event.target === null) return;
    this.rawScrape.headers[index] = event.target.value;
    this.scraperService.alterScrapeTable(this.rawScrape);
  }
  resetClickActions(){
    this.showScrapedColOptions = false;
    this.deletingCol = false;
    this.deletingRow = false;
    this.swappingCols = [-1,-1];
    this.movingCol = [-1,-1];
    this.truncatingCol = [-1, -1]; this.truncateColInput = ['', ''];
    this.fillingCol = [-1, -1, -1]; this.fillingColInput = ['', '']; this.fillingNotAdding = true; this.addingIndex = -1;
    this.columnIsHeaders = [-1,-1]; this.newHeaderIds = ['',''];
    this.alteringCells = false; this.alterCellInput = ['',''];
    this.addingPerPageVariable = false; this.perPageVariables = ['', '', ''];
    this.scraperService.alterScrapeTable(this.rawScrape);
  }
  handleColumnClick(index: number){
    if(this.deletingCol){
      this.scraperService.removeColumn(index); 
      this.deletingCol = false;
    }
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
    if(this.truncatingCol[0] == 0) {
      if(this.truncatingCol[1] == index){
        this.truncatingCol[1] = -1;
      } else {
        this.truncatingCol[1] = index;
      }
    }
    if(this.fillingCol[0] == 0) {
      if(this.fillingCol[1] == -1 && this.fillingCol[2] != index){
        this.fillingCol[1] = index;
      } else if(this.fillingCol[1] == index){
        this.fillingCol[1] = -1;
      } else if(this.fillingCol[2] == index){
        this.fillingCol[2] = -1;
      } else {
        this.fillingCol[2] = index;
      }
    }
    if(this.columnIsHeaders[0] == 0) {
      if(this.columnIsHeaders[1] == index){
        this.columnIsHeaders[1] = -1;
      } else {
        this.columnIsHeaders[1] = index;
      }
    }
  }

  swapCols(index: number){
    if(index != this.swappingCols[1]){
      this.scraperService.swapColumns(this.swappingCols[1], index);
    }
    this.resetClickActions();
  }
  moveCol(index: number){
    if(index != this.movingCol[1]){
      this.scraperService.moveColumns(this.movingCol[1], index);
    }
    this.resetClickActions();
  }


  changeTruncateInput(event: any, index: number){
    if(event.target === null) return;
    this.truncateColInput[index] = event.target.value;
  }
  truncateCol(){
    if(this.truncateColInput[0] == '' || this.truncateColInput[1] == '' || this.truncatingCol[1] == -1) return;
    this.scraperService.truncateColumnInputs(
      Number(this.truncateColInput[0]), 
      Number(this.truncateColInput[1]), 
      this.truncatingCol[1]
    );
    this.resetClickActions();
  }
  changeFillingInput(event: any, index: number){
    if(event.target === null) return;
    this.fillingColInput[index] = event.target.value;
  }
  changeAddingIndex(event: any){
    if(event.target === null) return;
    this.addingIndex = Number(event.target.value);
  }
  fillCol(){
    if(this.fillingCol[1] == -1 || this.fillingColInput[0] == '' 
      || this.fillingColInput[1] == '' || this.fillingCol[2] == -1) return;
    console.log(this.addingIndex);
    this.scraperService.fillColumnInputs(
      this.fillingCol[1], 
      this.fillingCol[2], 
      Number(this.fillingColInput[0]), 
      Number(this.fillingColInput[1]),
      this.addingIndex
    );
    this.resetClickActions();
  }
  addScrapedColumn(){
    this.scraperService.addColumn();
  }
  changeNewHeaderIds(event: any, index: number){
    if(event.target === null) return;
    this.newHeaderIds[index] = event.target.value;
  }
  changeHeadersToColumn(){
    if(this.newHeaderIds[0] == '' || this.newHeaderIds[1] == '' || this.columnIsHeaders[1] == -1) return;
    this.scraperService.columnValuesAreHeaders(
      this.columnIsHeaders[1],
      Number(this.newHeaderIds[0]), 
      Number(this.newHeaderIds[1]),
    );
    this.resetClickActions();
  }


  changeAlterCellInputs(event: any, index: number){
    if(event.target === null) return;
    this.alterCellInput[index] = event.target.value;
  }
  alterCells(){
    if(this.alterCellInput[0] == '' || this.alterCellInput[1] == '') return;
    
    const copyOf_rawScrape = new RawScrape(
      JSON.parse(JSON.stringify(this.rawScrape.headers)),
      []
    );

    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {    
        const copyOf_row: string[] = [];
        row.forEach((col) => {
          if(col === this.alterCellInput[0]){
            copyOf_row.push(this.alterCellInput[1]);
          } else {
            copyOf_row.push(col);
          }
        });
        copyOf_page.push(copyOf_row);
      });
      copyOf_rawScrape.data.push(copyOf_page);
    });

    this.scraperService.alterScrapeTable(copyOf_rawScrape);

    this.resetClickActions();
  }

  changePerPageVariable(event: any, index: number){
    if(event.target === null) return;
    this.perPageVariables[index] = event.target.value;
  }
  addPerPageVariable(){
    let start = Number(this.perPageVariables[0]);
    const end = Number(this.perPageVariables[1]);
    let incrimentBy = Math.round((end-start) / this.rawScrape.data.length);

    const copyOf_rawScrape = new RawScrape(
      [],
      []
    );
    
    let i = 0;
    while(i<this.rawScrape.headers.length){
      copyOf_rawScrape.headers.push(JSON.parse(JSON.stringify(this.rawScrape.headers[i])));
      i++;
    }
    copyOf_rawScrape.headers.push(this.perPageVariables[2]);

    this.rawScrape.data.forEach((page) => {
      const copyOf_page: string[][] = [];
      page.forEach((row) => {    
        const copyOf_row: string[] = [];
        row.forEach((col) => {
            copyOf_row.push(col);
        });
        copyOf_row.push(String(start));
        copyOf_page.push(copyOf_row);
      });
      copyOf_rawScrape.data.push(copyOf_page);
      start += incrimentBy;
    });

    this.scraperService.alterScrapeTable(copyOf_rawScrape);

    this.resetClickActions();

  }

  handleRowClick(index: number){
    if(this.deletingRow) this.deleteRow(index);
  }
  deleteRow(index: number){
    this.scraperService.removeRow(this.pageNumber, index);
    this.resetClickActions();
  }

  changePage(event:any){
    if(event.target === null) return;
    this.pageNumber = Number(event.target.value)-1 > this.numPages ? this.pageNumber : Number(event.target.value)-1;
  }

}
