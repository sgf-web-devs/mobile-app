import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";

@Injectable()
export class WebDevsApi {

    private baseUrl =  environment.webDevs.baseUrl;

    constructor(public http: HttpClient) {

    }

    checkin(userData) {
        let url = `${this.baseUrl}/api/checkin`;

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
