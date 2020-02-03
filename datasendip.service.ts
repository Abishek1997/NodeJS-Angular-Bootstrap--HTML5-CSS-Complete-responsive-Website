import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DatasendipService {
  url = '';
  constructor(private httpcall: HttpClient) { }

  async callServer(data_ipapi : object){

    var ipLat = data_ipapi['lat'];
    var ipLon = data_ipapi['lon'];
    this.url = 'http://abi57711997-angular.us-east-2.elasticbeanstalk.com/get_json_data_ip' + '?lat=' + ipLat + '&lon=' + ipLon;
    return await this.httpcall.get<any>(this.url).toPromise();
  }
}
