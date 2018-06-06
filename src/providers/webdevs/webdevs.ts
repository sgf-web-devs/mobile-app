import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {HTTP} from "@ionic-native/http";

@Injectable()
export class WebDevs {
    baseUrl: any;
    checkinPath: any;

    constructor(public http: Http, public httpNative: HTTP) {
        //this.baseUrl = 'http://sgf-web-devs-staging.glitchedmob.com';
        //this.checkinPath = 'api/checkin
        this.baseUrl = 'http://demo9029555.mockable.io';
        this.checkinPath = 'checkin';
    }

    checkin(userData){
        let headers = {
            'Content-Type': 'application/json'
        };

        //let url = 'https://admin.sgfwebdevs.com/api/checkin';
        let url = "https://requestbin.fullcontact.com/15i80oe1";

        let checkinData = {
            email: userData.email,
            name: userData.name,
            image: userData.photo.photo_link
        };


        let headers2 = new Headers({
            'Content-Type': 'application/json'
        });
        this.http.get(url, JSON.stringify(checkinData)).map(res => res.json());

        console.log(checkinData);

        this.httpNative.get(url, JSON.stringify(checkinData), headers).then(res=> {
            let response = JSON.parse(res.data);
            console.log(response);
        });

        return new Promise(resolve => {
            this.httpNative.post(url, JSON.stringify(checkinData), headers).then(res=> {
                let response = JSON.parse(res.data);
                resolve(response);
                console.log(response);
            });
        })

        //return this.http.post(`${url}`, userData, {headers: headers}).map(res => res.json());
    }
}
