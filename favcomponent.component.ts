import { Component, OnInit } from '@angular/core';
import {DatashareService} from '../datashare.service';
import {AppComponent} from '../app.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-favcomponent',
  templateUrl: './favcomponent.component.html',
  styleUrls: ['./favcomponent.component.css']
})
export class FavcomponentComponent implements OnInit {

  favdata = [];
  temp = [];
  url : string;

  tableHeader = ['#','Image','City','State','Favorites'];
  constructor(
    private _datashare: DatashareService,
    private _appcomponent: AppComponent,
    private httpcall : HttpClient
  ) { }

  ngOnInit() {
    this._datashare.fav_data_out.subscribe(
      data => {
        this.favdata = data;
      }
    )
  }

  onCityClick(message){
    this._appcomponent.onSubmit(true,message) 
  }
  ondelClick(data){
    this._datashare.del_fav_data_item(data)
  }

}
