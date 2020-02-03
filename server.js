const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
var path = require('path');

const PORT = 8081;

const app = express();
app.use(express.static(path.join(__dirname,'dist/myclient')));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req,res){

    res.send("working");
});

app.get('/auto_complete', function(req,res){

    var city_str = req.query.loc;
    request.get({url:"https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + city_str + '&types=(cities)&language=en&key=AIzaSyAPBlAEy3QbTBuA3rkqRd4UAb9AophJVm0'}, function(error,response,body){
        if (!error && response.statusCode == 200){
            res.status(200).send(body);
        }
        else{
            res.status(200).send("error");
        }
    });
});

app.get('/get_fav_weather', function(req,res){
    var lat = req.query.lat;
    var lon = req.query.lon;
    console.log(lat,lon);
    var dark_sky_ip_url = 'https://api.darksky.net/forecast/ab5f43553f9630945af0a4a8c0c3e4f2/' + lat + ',' + lon;
    dark_sky_ip_url = encodeURI(dark_sky_ip_url);
    request.get({url:dark_sky_ip_url}, function(error,response,body){
        if (!error && response.statusCode == 200){
            res.status(200).send(body);
        }
        else{
            res.status(200).send("error");
        }
    });
});

app.get('/get_json_data_ip',function(req,res){
    var lat = req.query.lat;
    var lng = req.query.lon;
    // console.log(lat,lng);
    var dark_sky_ip_url = 'https://api.darksky.net/forecast/ab5f43553f9630945af0a4a8c0c3e4f2/' + lat + ',' + lng;
    dark_sky_ip_url = encodeURI(dark_sky_ip_url);
    // console.log('hi',dark_sky_ip_url);
    request.get({url:dark_sky_ip_url}, function(error,response,body){
        if (!error && response.statusCode == 200){
            res.status(200).send(body);
        }
        else{
            res.status(200).send("error");
        }
    });
});

app.get('/get_modalData', function(req,res){
    var lat_m = req.query.lat;
    var lon_m = req.query.lon;
    var time_stamp = req.query.timestamp;
    var url_m = 'https://api.darksky.net/forecast/ab5f43553f9630945af0a4a8c0c3e4f2/' + lat_m + ',' + lon_m + ',' + time_stamp;
    url_m = encodeURI(url_m);
    request.get({url:url_m}, function(error_m,response_m,body_m){
        if (!error_m && response_m.statusCode == 200){
            res.status(200).send(body_m);
        }
        else{
            res.status(200).send("error");
        }
    });
})
app.get('/get_seal', function(req,res){

    var state = req.query.state;
    var id = req.query.id;
    var imgSize = req.query.imgSize;
    var key = req.query.key;

    var custom_search_url = 'https://www.googleapis.com/customsearch/v1?q='+ state + 'State Seal&cx='+ id + '&imgSize='+ imgSize + '&imgType=news&num=1&searchType=image&key=' + key;
    custom_search_url = encodeURI(custom_search_url);
    // console.log(custom_search_url);
    request.get({url:custom_search_url}, function(error,response,body){
        if (!error && response.statusCode == 200){
            var bdy = JSON.parse(body);
            res.status(200).send(bdy);
        }
        else{
            res.status(200).send("error");
        }
    });
});

app.get('/get_json_data_form',function(req,res){
    
    var street = req.query.street;
    var city = req.query.city;
    var state = req.query.state;

    // console.log(street,city,state);

    geocode_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + street + ',' + city + ',' + state + '&key=AIzaSyAPBlAEy3QbTBuA3rkqRd4UAb9AophJVm0';
    geocode_url = encodeURI(geocode_url);
    request.get({url:geocode_url}, function (error,response,body){
        if (!error && response.statusCode == 200){
            var bdy =JSON.parse(body);
            // console.log(bdy.status);
            if (bdy.status === 'OK'){
                // console.log('here');
                var lat_form = bdy.results[0].geometry.location.lat;
                var lng_form = bdy.results[0].geometry.location.lng;
                var dark_sky_form_url = 'https://api.darksky.net/forecast/ab5f43553f9630945af0a4a8c0c3e4f2/' + lat_form + ',' + lng_form;
                dark_sky_form_url = encodeURI(dark_sky_form_url);
                request.get({url:dark_sky_form_url}, function(error1,response1,body1){
                    if (!error1 && response1.statusCode == 200){
                        // console.log(body1);
                        res.status(200).send(body1);
                    }
                    else{
                        res.status(200).send("error");
                    }
                });
            }
            else{
                // console.log('there');
                res.status(200).send("error");
            }
        }
        else{
            res.status(200).send("error");
        } 
    })
});

app.listen(PORT, function(){

    console.log("Server is running on port: " + PORT);
})