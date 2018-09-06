import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import 'rxjs/add/operator/map';
import { Platform } from "ionic-angular";
import { Meetup } from "ng2-cordova-oauth/core";
import { Storage } from '@ionic/storage';
import { OauthBrowser } from "ng2-cordova-oauth/platform/browser";
import { OauthCordova } from "ng2-cordova-oauth/platform/cordova";

import { environment } from "../../environments/environment";


@Injectable()
export class MeetupApi {
    private accessToken: any;
    private baseUrl = 'https://api.meetup.com';
    private tokenStorageKey = 'meetup-access-token';
    private cordovaMeetupClientId = environment.meetup.cordovaClientId;
    private browserMeetupClientId = environment.meetup.browserClientId;
    private oauth: OauthCordova | OauthBrowser;
    private meetupProvider: Meetup;

    constructor(
        public http: HttpClient,
        public iab: InAppBrowser,
        private platform: Platform,
        private storage: Storage,
    ) {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            this.oauth = new OauthBrowser();
            this.meetupProvider = new Meetup({
                clientId: this.browserMeetupClientId,
                redirectUri: 'http://localhost:8100'
            });
        } else {
            this.oauth = new OauthCordova();
            this.meetupProvider = new Meetup({
                clientId: this.cordovaMeetupClientId,
            });

        }

        this.storage.get(this.tokenStorageKey).then(val => {
            this.setAccessToken(val);
        })
    }


    setAccessToken(token) {
        this.accessToken = token;
        this.storage.set(this.tokenStorageKey, token);
    }

    getAccessToken() {
        if(this.accessToken) {
            return Promise.resolve(this.accessToken);
        }

        return this.storage.get(this.tokenStorageKey);
    }

    getUserInfo() {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ' ${this.accessToken}`,
            'Content-Type': 'application/json'
        });


        return this.http.get(`${this.baseUrl}/2/member/self/`, { headers });
    }

    getCurrentUserInfo() {
        let memberV3Url = `${this.baseUrl}/members/self/?access_token=${this.accessToken}`;

        return this.http.get(memberV3Url);
    }

    rsvp(eventId, response) {
        let headers = new HttpHeaders();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?response=${response}&access_token=${this.accessToken}`;

        let payload = { response };
        return this.http.post(rsvpV3Url, payload, { headers })
            .map(res => res);
    }

    checkRSVP(eventId, userId) {
        let headers = new HttpHeaders();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?&access_token=${this.accessToken}`;
        console.log('checking rsvp for ', eventId);
        return this.http.get(rsvpV3Url, { headers }).map((res: any) => {
            let rsvps = res.json();
            for (let rsvp of rsvps) {
                if (rsvp.member.id === userId) {
                    return true;
                }
            }
            return false;
        });
    }

    getLatestEvent() {
        let eventsV3Url = `${this.baseUrl}/SGF-Web-Devs/events?scroll=recent_past&access_token=${this.accessToken}`;

        return new Promise(resolve => {
            this.http.get(eventsV3Url,).subscribe((res: any[]) => {
                let events = res;
                console.log(events);

                for (let event of events) {
                    if (event.status != 'past') {
                        resolve(event);
                    }
                }

                resolve(events[0]);
            });
        })
    }

    browserTokenOverride(token: string) {
        return new Promise((resolve, reject) => {
            if (token && token.length > 0) {
                this.accessToken = token;
                resolve();
            } else {
                reject('invalid token');
            }
        });
    }

    login() {
        return new Promise((resolve, reject) => {
            this.platform.ready().then(() => {

                if(this.accessToken) {
                    resolve();
                    return;
                }

                this.oauth.logInVia(this.meetupProvider, {
                    clearsessioncache: 'no',
                    clearcache: 'no'
                }).then((success: any) => {
                    this.setAccessToken(success.access_token);
                    resolve();
                })
                    .catch(error => {
                        reject(error);
                    });
            });
        });
    }
}
