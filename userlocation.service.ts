import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserlocationService {

  url="http://ip-api.com/json";
  constructor(private httpcall: HttpClient) { }


  get_location(){
    // return this._http.post<any>(this._url,code);
    return this.httpcall.get<any>(this.url);

  }
}
