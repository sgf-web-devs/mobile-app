import { Injectable } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {HTTP} from "@ionic-native/http";

@Injectable()
export class WebDevs {

    constructor(public http: HTTP) {

    }

    checkin(userData) {
        let url = 'https://admin.sgfwebdevs.com/api/checkin';

        return new Promise(resolve => {
            let checkinData = {
                email: userData.email,
                name: userData.name,
                image: userData.photo.photo_link
            };

            this.http.post(url, checkinData, {}).then(res => {
                resolve(res.data);
            });
        });
    }
}
