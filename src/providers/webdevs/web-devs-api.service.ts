import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class WebDevsApi {

    constructor(public http: HttpClient) {

    }

    checkin(userData) {
        let url = 'https://admin.sgfwebdevs.com/api/checkin';

        return new Promise(resolve => {
            let checkinData = {
                email: userData.email,
                name: userData.name,
                image: userData.photo.photo_link
            };

            this.http.post(url, checkinData, {}).subscribe(res => {
                resolve(res);
            });
        });
    }
}
