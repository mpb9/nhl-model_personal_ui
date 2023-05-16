import { Injectable } from "@angular/core";
import axios from "axios";

 
@Injectable()
export class SqlActionsService{

  insertData(tableName: string, columns: string[], data: string[][][]){
    const API_URL = 'http://localhost/bet-apis/sql-queriers/insert_data.php';

    axios({
      method: "post",
      url: `${API_URL}`,
      headers: { "content-type": "application/json" },
      data: {
        tableName,
        columns,
        data
      }
    }).then((result)=>{
      console.log(result);
    }).catch((error) => console.log(error));
  }

}