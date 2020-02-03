import { Component } from '@angular/core';
import {FormBuilder, Validators, FormGroup, NgForm, CheckboxControlValueAccessor} from '@angular/forms';
import {DatasendService} from './datasend.service';
import {UserlocationService} from './userlocation.service'
import {DatasendipService} from './datasendip.service';
import {DatashareService} from './datashare.service';
import {HttpClient} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  toggle_alert = true;
  city: string = '';
  tog_yellow = false;
  temp: number;
  summary: string = "";
  wrapper_hide = true;
  hide_progress = true;
  twitter_data : string;
  id = 'Select State';
  arr = [];
  ab = [];
  stateVal :string = '';
  userLocObj : object;
  ip_api_data : {};
  form_data : object;
  activeString: string = "tab_selectbyid3";
  link : string = '';
  arrlocalStorage = [];
  favdisplay = true;
  data_fav = {};
  abbreviation : string;
  url_x : any;
  acOptions: any;
  buttonDisable = true;
  dataForm = this.fb.group({

    streetName : ['', Validators.required],
    cityName : ['', Validators.required ],
    stateName : ['Select State',Validators.required],
    currentLocation: [false]
  });
  constructor(
    private fb: FormBuilder,
    private sendService: DatasendService,
    private _userloc: UserlocationService,
    private sendipService: DatasendipService,
    private _dataShare: DatashareService,
    private httpcall : HttpClient
    ){}
  
  states = this.getStates();
  isDisabled: boolean = false;

  getStates(){
    for (let i=0; i < data.States.length; i++){
      this.arr[i] = (data.States[i].State);
    }
    return this.arr;
  }

  onStateSelect(value){
    if (value == 'Select State'){
      console.log(value);
      this.buttonDisable = true;
    }
    else{
      console.log(value);
      this.buttonDisable = false;
    }
  }

  async onClickCheckbox(e){
    if (e.target.checked){
      this.stateVal = 'California';
      this._dataShare.state_data_onChange(this.stateVal);
      this.userLocObj = await this._userloc.get_location().toPromise();
      this.dataForm.controls['streetName'].disable();
      this.dataForm.controls['cityName'].disable();
      this.dataForm.controls['stateName'].disable();
    }
    else{
      this.dataForm.controls['streetName'].enable();
      this.dataForm.controls['cityName'].enable();
      this.dataForm.controls['stateName'].enable();
    }
  }
  doClear(form:NgForm){
    this.buttonDisable = true;
    this.favdisplay = true;
    this.hide_progress = true;
    this.wrapper_hide = true;
    this.toggle_alert = true;
    form.reset()
    this.dataForm.patchValue({
      streetName: '',
      cityName: '',
      stateName: 'Select State',
      currentLocation: false
    });

    this.dataForm.controls['streetName'].enable();
    this.dataForm.controls['cityName'].enable();
    this.dataForm.controls['stateName'].enable();


    if(document.getElementById('fav').classList.contains('colorb')){
      document.getElementById('fav').classList.remove('colorb');
    }
    document.getElementById('results').classList.add('colorb');
  }

  async onSubmit(fav_click, fav_obj){
    this.toggle_alert = true;
    this.hide_progress = false;
    this.wrapper_hide = true;
    this.activeString = "tab_selectbyid1";
    if(fav_click){
      var state_ab = fav_obj['state'];
      for (let i=0; i<data.States.length ; i++){
        if (state_ab == data.States[i].Abbreviation){
          this.stateVal = data.States[i].State;
        }
      }
      console.log(fav_obj);
      console.log(this.stateVal);
      this._dataShare.state_data_onChange(this.stateVal);
      await this.sendipService.callServer(fav_obj)
        .then(
          data =>{ 
          this.data_fav['lat'] = data['latitude'];
          this.data_fav['lon'] = data['longitude'];
          this._dataShare.weather_data_onChange(data);
          this.hide_progress = true;
          this.wrapper_hide = false;
          this.temp = data['currently']['temperature'];
          this.city = fav_obj['city'];
          this._dataShare.city_data_onChange(this.city);
          this.summary = data['currently']['summary'];
          },
          //display invalid address here if error
          error => {
            console.log("Error",error);
          }
        )
    }
    else{
    // console.log(this.stateVal);
    
    if (this.dataForm.value.currentLocation){
      //sending ip-api values with lat-lng values
      ip_api_url : String[10] = "";
      await this.sendipService.callServer(this.userLocObj)
        .then(
          data =>{ this.ip_api_data = data;
          this.data_fav['lat'] = this.ip_api_data['latitude'];
          this.data_fav['lon'] = this.ip_api_data['longitude'];
          this._dataShare.weather_data_onChange(data);
          this.hide_progress = true;
          this.wrapper_hide = false;
          this.temp = this.ip_api_data['currently']['temperature'];
          this.city = this.userLocObj['city'];
          this._dataShare.city_data_onChange(this.city);
          this.summary = this.ip_api_data['currently']['summary'];
          },
          //display invalid address here if error
          error => {
            console.log("Error",error);
          }
        )
    }
    else{
      this.stateVal = (document.getElementById('stateselect') as HTMLInputElement).value;
      this._dataShare.state_data_onChange(this.stateVal);
      // console.log(this.dataForm.value);
      //submitting the formvalues to node to get lat-lng values
      await this.sendService.callServer(this.dataForm.value)
        .then(
          data =>{
            this.ip_api_data = data;
            this.data_fav['lat'] = this.ip_api_data['latitude'];
            this.data_fav['lon'] = this.ip_api_data['longitude'];
            this._dataShare.weather_data_onChange(data);
            this.hide_progress = true;
            this.wrapper_hide = false;
            this.temp = this.ip_api_data['currently']['temperature'];
            this.city = (document.getElementById('cityNameid') as HTMLInputElement).value;
            this._dataShare.city_data_onChange(this.city);
            this.summary = this.ip_api_data['currently']['summary'];
            },
          //display invalid address here if error
          error => {
            this.wrapper_hide = true;
            this.hide_progress = true;
            this.toggle_alert = false;
            console.log("Error",error);
            
          }
        )
    }
  }

    if (this._dataShare.check_if_fav_exists(this.data_fav)){
      this.tog_yellow = true;
    }
    else
    this.tog_yellow = false;

    this.twitter_data = encodeURI("The current temperature at " + this.city + " is " + this.temp + "\u00B0 F. The weather conditions are " + this.summary + ".\n&hashtags=CSCI571WeatherSearch");
    this.onResClick()
  }

  onResClick(){
    this.favdisplay = true;
    if(document.getElementById('fav').classList.contains('colorb')){
      document.getElementById('fav').classList.remove('colorb');
    }
    document.getElementById('results').classList.add('colorb');
  }

  onFavClick(){
    this.favdisplay = false;
    this.toggle_alert = true;
    this.wrapper_hide = true;
    if(document.getElementById('results').classList.contains('colorb')){
      document.getElementById('results').classList.remove('colorb');
    }
    document.getElementById('fav').classList.add('colorb');
  }

  ngOnInit(){
    this.acOptions = this.cityName.valueChanges
    .pipe(
      switchMap(data => this.sendService.autocomplete_function(this.cityName.value))
      );
  }
  get cityName(){
    return this.dataForm.get('cityName')
  }
  changeColor(){

    if(this.tog_yellow){
      this._dataShare.del_fav_data_item(this.data_fav)
    }
    else{

      this._dataShare.seal_data_out.subscribe(
        data => {
          this.link = data;
        }
      )
      var localStorageObj  = {};
      localStorageObj['lat'] = this.ip_api_data['latitude'];
      localStorageObj['lon'] = this.ip_api_data['longitude'];
      localStorageObj['link'] = this.link;
      for (let i=0; i< data.States.length; i++){
        if (this.stateVal == data.States[i].State)
        this.abbreviation = data.States[i].Abbreviation;
      } 
      localStorageObj['state'] = this.abbreviation;
      localStorageObj['city'] = this.city;
      this._dataShare.add_fav_data_item(localStorageObj)
    }
    this.tog_yellow = !this.tog_yellow;

    
    } 
}
import data from './states.json';

