import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class WebDevs {
    baseUrl: any;
    checkinPath: any;
 
    constructor(public http: Http) {
        //this.baseUrl = 'http://sgf-web-devs-staging.glitchedmob.com';       
        //this.checkinPath = 'api/checkin
        this.baseUrl = 'http://demo9029555.mockable.io';
        this.checkinPath = 'checkin';
    }

    checkin(userData){
        let headers = new Headers({
                'Content-Type': 'application/json'
        });
        return this.http.post(`${this.baseUrl}/${this.checkinPath}`, userData, {headers: headers}).map(res => res.json());
    }
}