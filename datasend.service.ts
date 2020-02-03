import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import data_json from './states.json';

@Injectable({
  providedIn: 'root'
})
export class DatasendService {
  url = 'http://abi57711997-angular.us-east-2.elasticbeanstalk.com/get_json_data_form';
  constructor(private httpcall: HttpClient) { }

  async callServer(data:object){
    // console.log(data);
    var formStreet = data['streetName'];
    var formCity = data['cityName'];
    var formState = data['stateName'];
    var state_ab = '';
    for (let i =0; i<data_json.States.length; i++){
      
      if (formState == data_json.States[i].State){
        state_ab = data_json.States[i].Abbreviation;
      }
    }
    // console.log(formCity,formState,formStreet);
    this.url = 'http://abi57711997-angular.us-east-2.elasticbeanstalk.com/get_json_data_form' + '?street=' + formStreet + '&city=' + formCity + '&state=' + state_ab;
    // console.log( this.url);
    return await this.httpcall.get<any>(this.url).toPromise();
  }

  async autocomplete_function(city:any){
    var _nodeUrl = "http://abi57711997-angular.us-east-2.elasticbeanstalk.com/auto_complete?loc=" + city;
    return await this.httpcall.get<JSON>(_nodeUrl).toPromise();
  }
}
