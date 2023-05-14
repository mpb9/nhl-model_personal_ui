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
  @Input('rawScraped') rawScrape!: RawScrape;
  query!: Query;

  showDiagnostics: boolean = false;

  constructor(private queryService: QueryService, private scraperService: ScraperService){}

  ngOnInit(){
    this.query = this.queryService.getQueryCopy();
    if(this.rawScrape.headers.length == 0){
      this.rawScrape = new RawScrape(
        ['fakeHeader1', 'Header2', 'fakeHeader3', 'fake4', 'fakeHeader5', 'fh6', 'fakeHeader7'],
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
  }



}
