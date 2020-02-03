import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatashareService {

  weather_data : object = {};
  weather_data_in = new BehaviorSubject(this.weather_data);
  weather_data_out = this.weather_data_in.asObservable();

  modal_data : object = {};
  modal_data_in = new BehaviorSubject(this.modal_data);
  modal_data_out = this.modal_data_in.asObservable();

  city_data : object = {};
  city_data_in = new BehaviorSubject(this.city_data);
  city_data_out = this.city_data_in.asObservable();

  seal_data : string = '';
  seal_data_in = new BehaviorSubject(this.seal_data);
  seal_data_out = this.seal_data_in.asObservable();
  
  fav_data = [];
  fav_data_in = new BehaviorSubject(this.fav_data);
  fav_data_out = this.fav_data_in.asObservable();
  

  state_data = [];
  state_data_in = new BehaviorSubject(this.state_data);
  state_data_out = this.state_data_in.asObservable();
  
  constructor() { 
    this.getfrombrowser()
  }

  getfrombrowser(){
     if (localStorage.getItem('abishek_cache') != null){
      var temp = JSON.parse(localStorage.getItem('abishek_cache'));
      this.fav_data_in.next(temp)
      this.fav_data = temp
     }
  }
  weather_data_onChange(message: object){
    this.weather_data_in.next(message);
  }

  modal_data_onChange(message: object){
    this.modal_data_in.next(message);
  }

  city_data_onChange(message: any){
    this.city_data_in.next(message);
  }
  seal_data_onChange(message:string){
    this.seal_data_in.next(message);
  }

  state_data_onChange(message:any){
    this.state_data_in.next(message);
  }

  del_fav_data_item(message){

    var temp = this.fav_data.filter(obj=>obj.lat!=message.lat && obj.lon !=message.lon)
    this.fav_data = temp;
    this.fav_data_in.next(this.fav_data);
    localStorage.setItem('abishek_cache', JSON.stringify(this.fav_data))
  }

  add_fav_data_item(message){

    this.fav_data.push(message)
    this.fav_data_in.next(this.fav_data);
    localStorage.setItem('abishek_cache', JSON.stringify(this.fav_data))
  }
  check_if_fav_exists(message){
    var temp = []
    temp = this.fav_data.filter(obj=>obj.lat==message.lat && obj.lon ==message.lon)
   
    return (temp.length>0)
  }
}

