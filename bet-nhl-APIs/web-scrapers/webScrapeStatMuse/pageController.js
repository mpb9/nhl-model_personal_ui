//NEW
//const  './JSON2SQL';
const JSON2SQL = require('./JSON2SQL');
//OLD
const pageScraper = require('./pageScraper');
const fs = require('fs');

async function scrapeAll(browserInstance){
	let browser;
	try{
		//NEW
		let table = "";
		let column = "";
		let columns = [];
		while(true){
			table = prompt("Table name: ");
			column = prompt('Column name: ');
			
			if(column === "") break;	
			columns.push(column);
		}
		console.log(table);
		console.log(columns);
		//OLD

		browser = await browserInstance;
		let data = {};
		data = await pageScraper.scraper(browser);	

		await browser.close();

		fs.writeFile(table + ".json", JSON.stringify(data), 'utf8', function(err){
			if(err) {
				return console.log(err);
			} 
			//NEW
			JSON2SQL.convert(table, columns, data);

			//OLD
		})

	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance)