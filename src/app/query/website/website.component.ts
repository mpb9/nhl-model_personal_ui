import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Website } from '../query.model';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  // can try to make multiple pages be false if returning from edit and it was false for prev query
  multiplePages = true; 
  multiplePagesText = "Just One Page?";

  websites!: Website[];
  @ViewChild('baseUrl') baseUrlRef!: ElementRef;
  currentUrl: string = "";
  extensionGroups: string[][] = [["", "", "", ""]];
  extensions: string[] = [];

  constructor(private queryService: QueryService){}

  ngOnInit(){
    this.websites = this.queryService.getWebsites();
    this.queryService.websitesChanged.subscribe(
      (websites: Website[]) => { this.websites = websites; }
    );
    this.extensions = this.queryService.getQuery().website.extensions;
    this.currentUrl = this.queryService.getQuery().website.baseUrl;
  }

  multiplePagesChanged(){
    this.multiplePages = !this.multiplePages;
    this.multiplePagesText = this.multiplePages ? "Just One Page?" : "Need Multiple Pages?";

    this.extensions = [];
    this.extensionGroups = [["", "", "", ""]];
    this.queryService.updateQueryWebsite(new Website('', []));
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
    let existingSearches = this.websites.filter((website) => website.baseUrl === url);

    if(existingSearches !== undefined && this.multiplePages){
      this.extensions = existingSearches[0].extensions;
      this.extensionGroups = [];
      for(let i = 0; i< this.extensions.length; i+=4){
        this.extensionGroups.push([
          this.extensions[i], this.extensions[i+1],
          this.extensions[i+2], this.extensions[i+3]
        ]);
      }
    }

    this.updateWebsite();
  }

  updateWebsite(){
    let websiteSelected = new Website(this.baseUrlRef.nativeElement.value, this.extensions);
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
    this.queryService.updateQueryWebsite(new Website(this.baseUrlRef.nativeElement.value, []));
  }

}
