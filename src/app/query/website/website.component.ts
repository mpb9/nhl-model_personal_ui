import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Query, Website } from '../query.model';
import { QueryService } from '../query.service';
import { query } from '@angular/animations';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  // can try to make multiple pages be false if returning from edit and it was false for prev query
  multiplePages = true; 
  multiplePagesText = "Just One Page?";
  //queries: Query[] = [];
  @ViewChild('baseUrl') baseUrlRef!: ElementRef;
  currentUrl: string = "";
  extensionGroups: string[][] = [["", "", "", ""]];
  extensions: string[] = [];
  query_id: number = -1;

  constructor(private queryService: QueryService){}

  ngOnInit(){
    //this.queries = this.queryService.loadQueries();
    this.queryService.queryChanged.subscribe(() => {
      const currentWebsite = this.queryService.getQueryCopy().website;
      this.extensions = currentWebsite.extensions;
      this.currentUrl = currentWebsite.baseUrl;
      this.query_id = currentWebsite.query_id;
    });

  }

  multiplePagesChanged(){
    this.multiplePages = !this.multiplePages;
    this.multiplePagesText = this.multiplePages ? "Just One Page?" : "Need Multiple Pages?";

    this.extensions = [];
    this.extensionGroups = [["", "", "", ""]];
    this.queryService.updateQueryWebsite(new Website(this.query_id, '', []));
  }

  updateExtensions(event: any, index: number){
    if(event.target === null) return;
    if(index === this.extensions.length){
      this.extensions.push(event.target.value);
    } else {
      if(index > this.extensions.length) console.log("INDEX > EXT LENGTH");

      this.extensions[index] = event.target.value;
    }
    this.updateWebsite();
  }

  autoCompleteExtensions(url: string){
    /* let existingSearches = this.queries.filter((query) => query.website.baseUrl === url);

    if(existingSearches !== undefined && this.multiplePages){
      this.extensions = existingSearches[0].website.extensions;
      this.extensionGroups = [];
      for(let i = 0; i< this.extensions.length; i+=4){
        this.extensionGroups.push([
          this.extensions[i], this.extensions[i+1],
          this.extensions[i+2], this.extensions[i+3]
        ]);
      }
    }

    this.updateWebsite(); */
  }

  updateWebsite(){
    let websiteSelected = new Website(this.query_id, this.baseUrlRef.nativeElement.value, this.extensions);
    this.queryService.updateQueryWebsite(websiteSelected);
  }

  moreExtInputs(){
    this.extensions.push("");     
    this.extensions.push("");
    this.extensions.push("");
    this.extensions.push("");
    this.extensionGroups.push(["", "", "", ""]);
  }

  clearExtInputs(){
    this.extensions = [];
    this.extensionGroups = [["", "", "", ""]];
    this.queryService.updateQueryWebsite(new Website(this.query_id, this.baseUrlRef.nativeElement.value, []));
  }

}
