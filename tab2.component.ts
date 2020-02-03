import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatashareService} from '../datashare.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component implements OnInit {

  weather_message : object
  currentlyData : object
  timeZone : any;
  hourlyTemp: any;
  hourlySummary : any;
  hourlyHumidity : any;
  hourlyPressure : any;
  hourlyWindSpeed : any;
  hourlyVisibility : any;
  hourlyCloudCover : any;
  hourlyOzone : any;
  _url :string = '';
  link :string = '';
  arr_temperature = [];
  arr_pressure = [];
  arr_humidity = [];
  arr_ozone = [];
  arr_visibility = [];
  arr_windSpeed = [];

public ctx : any;
public myChart :any;

  constructor(
    private _dataShare: DatashareService,
    private httpcall: HttpClient
  ) { }
  
  onChange(e){
    if (e == "Temperature"){
      this.myChart.data.datasets[0].data = this.arr_temperature;
      this.myChart.data.datasets[0].label = "Temperature";
      this.myChart.options.scales.yAxes[0].scaleLabel.labelString = "Fahrenheit";
    }
    else if (e == "Pressure"){
      this.myChart.data.datasets[0].data = this.arr_pressure;
      this.myChart.data.datasets[0].label = "Pressure";
      this.myChart.options.scales.yAxes[0].scaleLabel.labelString = "Millibars";
    }
    else if (e == "Humidity"){
      this.myChart.data.datasets[0].data = this.arr_humidity;
      this.myChart.data.datasets[0].label = "Humidity";
      this.myChart.options.scales.yAxes[0].scaleLabel.labelString = "% Humidity";
    }
    else if (e == "Ozone"){
      this.myChart.data.datasets[0].data = this.arr_ozone;
      this.myChart.data.datasets[0].label = "Ozone";
      this.myChart.options.scales.yAxes[0].scaleLabel.labelString = "Dobson Units";
    }
    else if (e == "Visibility"){
      this.myChart.data.datasets[0].data = this.arr_visibility;
      this.myChart.data.datasets[0].label = "Visibility";
      this.myChart.options.scales.yAxes[0].scaleLabel.labelString = "Miles (Maximum 10)";
    }
    else if (e == "WindSpeed"){
      this.myChart.data.datasets[0].data = this.arr_windSpeed;
      this.myChart.data.datasets[0].label = "Wind Speed";
      this.myChart.options.scales.yAxes[0].scaleLabel.labelString = "Miles per Hour";
    }
    this.myChart.update();
  }

  ngOnInit() {
    var canvas : any = document.getElementById("myChart");
    this.ctx = canvas.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
          datasets:[
            {data: [], 
            label: 'Temperature',
            backgroundColor : '#91CBF0',
            hoverBackgroundColor: '#5C87A4',
            }
          ]
      },
      options : {
        legend: {
          onClick: (e) => e.stopPropagation()
        },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Fahrenheit'
            }
          }]
        } 
      },
    });
    this._dataShare.weather_data_out.subscribe(
      message => 
       { this.weather_message = message;
        if (this.weather_message.hasOwnProperty('hourly')){
          for (let i=0; i<=23;i++){
            this.arr_temperature.push(this.weather_message['hourly']['data'][i].temperature);
            this.arr_pressure.push(this.weather_message['hourly']['data'][i].pressure);
            this.arr_humidity.push(this.weather_message['hourly']['data'][i].humidity);
            this.arr_ozone.push(this.weather_message['hourly']['data'][i].ozone);
            this.arr_visibility.push(this.weather_message['hourly']['data'][i].visibility);
            this.arr_windSpeed.push(this.weather_message['hourly']['data'][i].windSpeed);
            this.myChart.data.datasets[0].data = this.arr_temperature;
          }
        }
      }
    )
    this.onChange('Temperature')
  }
}
