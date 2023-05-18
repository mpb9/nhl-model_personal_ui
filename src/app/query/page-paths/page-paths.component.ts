import { Component, Input, OnInit } from '@angular/core';
import { QueryService } from '../query.service';
import { PagePath, Query } from '../query.model';

@Component({
  selector: 'app-page-paths',
  templateUrl: './page-paths.component.html',
  styleUrls: ['./page-paths.component.css']
})
export class PagePathsComponent implements OnInit {
  path: PagePath = new PagePath(-1, "NA", "NA", "", "tr > td", 0, []);

  savedHeaderPaths = ["NA", "NA"];
  headerPathExists = true;

  customHeaderName = '';
  customDataPath = '';

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.queryService.queryChanged.subscribe(() => {
      this.path = this.queryService.getQueryCopy().pagePath;
      if(this.path.toAllHeaders == 'NA'){
        this.headerPathExists = false;
      } else {
        this.headerPathExists = true;
      }
    });

  }

  alterPath(event: any, index: number){
    if(event.target === null) return;
    if(index === 0) this.path.toAllHeaders = event.target.value;
    else if(index === 1) this.path.toHeaderElement = event.target.value;
    else if(index === 2) this.path.toAllData = event.target.value;
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
    this.path = new PagePath(this.queryService.getQueryCopy().query_id, "NA", "NA", "", "tr > td", 0, []);
    this.queryService.updateQueryPagePath(this.path);
  }

  notUsingHeaders(){
    this.headerPathExists = false; 
    this.savedHeaderPaths = [this.path.toAllHeaders, this.path.toHeaderElement];
    this.path.toAllHeaders = 'NA'; 
    this.path.toHeaderElement= 'NA'
    this.updatePath();
  }

  usingHeaders(){
    this.headerPathExists = true; 
    this.path.toAllHeaders = this.savedHeaderPaths[0];
    this.path.toHeaderElement = this.savedHeaderPaths[1];
    this.updatePath();
  }

  alterCustomCol(event: any, custom_id: number, change_type: number){
    if(event.target === null) return;
    this.path.customColumns[custom_id][change_type] = event.target.value;
    this.updatePath();
  }
}
