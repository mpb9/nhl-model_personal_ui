import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Query, Website } from '../query.model';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  multiplePagesText = "Just One Page?";

  @ViewChild('baseUrl') baseUrlRef!: ElementRef;
  currentUrl: string = "";
  extensions: string[] = [""];
  query_id: number = -1;

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.queryService.queryChanged.subscribe(() => {
      const currentWebsite = this.queryService.getQueryCopy().website;
      this.currentUrl = currentWebsite.baseUrl;
      this.query_id = currentWebsite.query_id;
      this.extensions = currentWebsite.extensions.length > 0 ? currentWebsite.extensions : [""];
    });
  }

  multiplePagesChanged(){
    this.multiplePagesText = this.multiplePagesText == "Just One Page?" ? "Need Multiple Pages?" : "Just One Page?";

    this.extensions = [""];
    this.queryService.updateQueryWebsite(new Website(this.query_id, this.currentUrl, [""]));
  }

  updateExtensions(event: any, index: number){
    if(event.target === null){
      this.extensions[index] = '';
      return;
    } 
    
    this.extensions[index] = event.target.value;
    
    this.updateWebsite();
    console.log(this.extensions);
  }

  updateWebsite(){
    let websiteSelected = new Website(this.query_id, this.baseUrlRef.nativeElement.value, this.extensions);
    this.queryService.updateQueryWebsite(websiteSelected);
  }

  clearCurrent(){
    this.extensions = [""];
    this.currentUrl = "";
    this.queryService.updateQueryWebsite(new Website(this.query_id, this.currentUrl, this.extensions));
  }

}
