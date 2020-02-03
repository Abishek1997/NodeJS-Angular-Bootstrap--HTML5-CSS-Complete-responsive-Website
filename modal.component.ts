import { Component, OnInit } from '@angular/core';
import {DatashareService} from '../datashare.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  _modaldata : any;
  city_data : any;
  datetime : any;
  date : any;
  temp : any;
  icon : any;
  summary : any;
  icon_src : any;
  precip : any;
  chanceofrain: any;
  windspeed : any;
  humidity : any;
  visibility : any;

  constructor(
    private _datamodal : DatashareService,
    private _activemodal: NgbActiveModal
  ) { }

  ngOnInit() {
    
    this._datamodal.modal_data_out.subscribe(
      message => {
        this._modaldata = message;
        this.datetime = new Date(this._modaldata['currently'].time * 1000);
        var year = this.datetime.getFullYear();
        var month = this.datetime.getMonth() + 1;
        var date = this.datetime.getDate();
        this.date = date + '/' + month + '/' + year;
        this.temp = this._modaldata['currently'].temperature;
        this.summary = this._modaldata['currently'].summary;
        this.icon = this._modaldata['currently'].icon;
        this.precip = this._modaldata['currently'].precipIntensity;
        this.chanceofrain = this._modaldata['currently'].precipProbability;
        this.windspeed = this._modaldata['currently'].windSpeed;
        this.humidity = this._modaldata['currently'].humidity;
        this.visibility = this._modaldata['currently'].visibility;

        if ((this.icon == 'clear-day') || (this.icon == 'clear-night')){
          this.icon_src = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png';
        }

        else if(this.icon == 'rain'){
          this.icon_src = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png';
        }
        else if(this.icon == 'snow'){
          this.icon_src = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png';
        }
        else if(this.icon == 'sleet'){
          this.icon_src = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png';
        }
        else if(this.icon == 'wind'){
          this.icon_src = 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png';
        }
        else if(this.icon == 'fog'){
          this.icon_src = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png';
        }
        else if(this.icon == 'cloudy'){
          this.icon_src = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png';
        }
        else if((this.icon == 'partly-cloudy-day') || (this.icon == 'partly-cloudy-night')){
          this.icon_src = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png';
        }
        if (this.precip > 0){
          this.precip = parseFloat(this.precip).toFixed(2);
        }
        
        if(this.chanceofrain > 0){
          this.chanceofrain = parseFloat(this.chanceofrain).toFixed(2);
          this.chanceofrain *= 100;
        }
        if (this.humidity > 0){
          this.humidity = parseFloat(this.humidity).toFixed(2);
          this.humidity *= 100;
        }
        this.temp = parseInt(this.temp);
        if(this.windspeed > 0){
        this.windspeed = parseFloat(this.windspeed).toFixed(2);
        }
        if(this.visibility > 0){
          this.visibility = parseFloat(this.visibility).toFixed(2);
        }
      }

    )
    this._datamodal.city_data_out.subscribe(
      message => {
        this.city_data = message;
      }
    )
  }
}
