import { Component, Input, OnInit } from '@angular/core';
import { QueryService } from '../query.service';
import { PagePath, Query } from '../query.model';

@Component({
  selector: 'app-page-paths',
  templateUrl: './page-paths.component.html',
  styleUrls: ['./page-paths.component.css']
})
export class PagePathsComponent implements OnInit {
  path: PagePath = new PagePath(-1, "", "", "");

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

  updatePath(){
    this.queryService.updateQueryPagePath(this.path);
  }

  clearPathInputs(){
    this.path = new PagePath(this.queryService.getQueryCopy().query_id, "", "", "");
    this.queryService.updateQueryPagePath(this.path);
  }

}
