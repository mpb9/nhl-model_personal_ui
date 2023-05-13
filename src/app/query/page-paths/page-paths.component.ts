import { Component, Input, OnInit } from '@angular/core';
import { QueryService } from '../query.service';
import { PagePath, Query } from '../query.model';

@Component({
  selector: 'app-page-paths',
  templateUrl: './page-paths.component.html',
  styleUrls: ['./page-paths.component.css']
})
export class PagePathsComponent implements OnInit {
  path: PagePath = new PagePath(-1, "", "", "", 0);

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.queryService.queryChanged.subscribe(() =>
      this.path = this.queryService.getQueryCopy().pagePath
    );
  }

  alterPath(event: any, index: number){
    if(event.target === null) return;
    if(index === 0) this.path.toTable = event.target.value;
    else if(index === 1) this.path.toAllData = event.target.value;
    else this.path.toDataElement = event.target.value;
    
    this.updatePath();
  }
  alterNumCols(event:any){
    if(event.target === null) return;
    this.path.numCols = event.target.value;
    this.updatePath();
    
    console.log(this.queryService.getQueryCopy().pagePath);
  }

  updatePath(){
    this.queryService.updateQueryPagePath(this.path);
  }

  clearPathInputs(){
    this.path = new PagePath(this.queryService.getQueryCopy().query_id, "", "", "", 0);
    this.queryService.updateQueryPagePath(this.path);
  }

}
