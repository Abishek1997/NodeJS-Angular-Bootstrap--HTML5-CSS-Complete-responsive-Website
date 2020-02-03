import { Component, OnInit, Input } from '@angular/core';
import {DatashareService} from '../datashare.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.css']
})
export class Tab1Component implements OnInit {
  
  weather_message : object
  currentlyData : object
  timeZone : any;
  currentlyTemp: any;
  currentlySummary : any;
  currentlyHumidity : any;
  currentlyPressure : any;
  currentlyWindSpeed : any;
  currentlyVisibility : any;
  currentlyCloudCover : any;
  currentlyOzone : any;
  _url :string = '';
  link :string = '';
  state : any;
  city : any;

 async getSeal(state){
    // console.log(state);
    this._url = 'http://abi57711997-angular.us-east-2.elasticbeanstalk.com/get_seal?state=' + state + '&id=005895356040263599874:metybryumto&imgSize=medium&num=1&searchType=image&key=AIzaSyAPBlAEy3QbTBuA3rkqRd4UAb9AophJVm0';
    this.httpcall.get<any>(this._url).subscribe(
      data =>{ this.link = data.items[0].link;
        this._dataShare.seal_data_onChange(this.link);
      }
    )
  }
  constructor(
    private _dataShare: DatashareService,
    private httpcall: HttpClient
  ) { 
   this.weather_message =  {}
   this.currentlyData = {}
  }
  ngOnInit() {
    this._dataShare.state_data_out.subscribe(
      data =>{
        this.state = data;
      }
    )
    this._dataShare.city_data_out.subscribe(
      data =>{
        this.city = data;
      }
    )
    this._dataShare.weather_data_out.subscribe(
      message => 
       {
         this.weather_message = message;
        if (this.weather_message.hasOwnProperty('currently')){
          if (this.state){
            this.getSeal(this.state)
          }
          this.currentlyData = this.weather_message['currently'];
          this.currentlyTemp = parseInt(this.weather_message['currently'].temperature);
          this.currentlySummary = this.weather_message['currently'].summary;
          this.currentlyHumidity = this.weather_message['currently'].humidity;
          this.currentlyPressure = this.weather_message['currently'].pressure;
          this.currentlyWindSpeed = this.weather_message['currently'].windSpeed;
          this.currentlyVisibility = this.weather_message['currently'].visibility;
          this.currentlyCloudCover = this.weather_message['currently'].cloudCover;
          this.currentlyOzone = this.weather_message['currently'].ozone;
        }
        this.timeZone = this.weather_message['timezone'];
      }
    )
  }
}
