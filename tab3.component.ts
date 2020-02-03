import { Component, OnInit, Input} from '@angular/core';
import {DatashareService} from '../datashare.service';
import {HttpClient} from '@angular/common/http';
import * as CanvasJS from './canvasjs.min';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../modal/modal.component';
@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})


export class Tab3Component implements OnInit {

  
  weekly_data : object = {};
  public chart : any;
  weekly_temp = [];
  res_obj = [];
  dateString : any;
  timestamp : any;
  lat : any = 0;
  lon : any = 0;
  _url: any;
  modal_Data : any;
  
  constructor(
    private _dataShare: DatashareService,
    private modalService: NgbModal,
    private httpcall: HttpClient,
    private modals : NgbModal
  ) { }
    

  
  ngOnInit() {

      this._dataShare.weather_data_out.subscribe(
      message => {this.weekly_data = message['daily'].data[2].temperatureLow;
        this.lat = message['latitude'];
        this.lon = message['longitude'];
        for (let i=0; i <7; i++){
          this.weekly_temp = [parseInt(message['daily'].data[i].temperatureLow),parseInt(message['daily'].data[i].temperatureHigh)];
          var res_temp : object = {};
          var label : any;
          var datelabel: any;
          label = new Date(message['daily'].data[i].time * 1000);
          // console.log(label);
          var year = label.getFullYear();
          var month = label.getMonth() + 1;
          var date = label.getDate();
          datelabel = date + '/' + month + '/' + year;
          res_temp['y'] = this.weekly_temp;
          res_temp['label'] = datelabel;
          this.res_obj.push(res_temp);
        }
      }
    )
    // console.log(this.res_obj);
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "Weekly Weather"
      },
      dataPointWidth: 20,
      axisX: {
        title: "Days"
      },
      axisY: {
        gridThickness: 0,
        includeZero: false,
        title: "Temperature in Fahrenheit",
        interval: 10,
      }, 
      legend:{
        verticalAlign:"top"
      },
      data: [{
        color : "#93CAF1",
        legendText: "Day wise temperature range",
        showInLegend:true,
        type: "rangeBar",
        click: this.onClick,
        indexLabel: "{y[#index]}",
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        dataPoints: [
          { x: 10, y:this.res_obj['6'].y, label: this.res_obj['6'].label, lat: this.lat, lon: this.lon, httpcall: this.httpcall, datashare: this._dataShare, modal: this.modals},
          { x: 20, y:this.res_obj['5'].y, label: this.res_obj['5'].label, lat: this.lat, lon: this.lon , httpcall: this.httpcall,datashare: this._dataShare, modal: this.modals},
          { x: 30, y:this.res_obj['4'].y, label: this.res_obj['4'].label, lat: this.lat, lon: this.lon, httpcall: this.httpcall,datashare: this._dataShare, modal: this.modals},
          { x: 40, y:this.res_obj['3'].y, label: this.res_obj['3'].label, lat: this.lat, lon: this.lon, httpcall: this.httpcall,datashare: this._dataShare, modal: this.modals},
          { x: 50, y:this.res_obj['2'].y, label: this.res_obj['2'].label, lat: this.lat, lon: this.lon, httpcall: this.httpcall,datashare: this._dataShare, modal: this.modals},
          { x: 60, y:this.res_obj['1'].y, label: this.res_obj['1'].label, lat: this.lat, lon: this.lon, httpcall: this.httpcall,datashare: this._dataShare, modal: this.modals},
          { x: 70, y:this.res_obj['0'].y, label: this.res_obj['0'].label, lat: this.lat, lon: this.lon, httpcall: this.httpcall,datashare: this._dataShare, modal: this.modals}
        ]
      }]
    });
    chart.render();
   
  }
  onClick(e:any){
    var _http: HttpClient;
    _http = e.dataPoint.httpcall;
    // console.log(_http);
    this.dateString = e.dataPoint.label;
    var dataShare = e.dataPoint.datashare;
    this.dateString = this.dateString.split("/");
    this.dateString = this.dateString[1] + "/" + this.dateString[0] + "/" + this.dateString[2];
    this.timestamp = new Date(this.dateString).getTime()/1000;
    this._url = 'http://abi57711997-angular.us-east-2.elasticbeanstalk.com/get_modalData?lat=' + e.dataPoint.lat + '&lon=' + e.dataPoint.lon + '&timestamp=' + this.timestamp;
    _http.get<any>(this._url).subscribe(
      data =>{ this.modal_Data = data;
        dataShare.modal_data_onChange(data);
        e.dataPoint.modal.open(ModalComponent);
      }
    )
  }
  
}