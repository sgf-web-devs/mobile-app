import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import 'rxjs/add/operator/map';
import { HTTP } from '@ionic-native/http';
import { Platform } from "ionic-angular";
import { Meetup } from "ng2-cordova-oauth/core";
import { Storage } from '@ionic/storage';
import { OauthBrowser } from "ng2-cordova-oauth/platform/browser";
import { OauthCordova } from "ng2-cordova-oauth/platform/cordova";


@Injectable()
export class MeetupApi {
    private accessToken: any;
    private baseUrl = 'https://api.meetup.com';
    private tokenStorageKey = 'meetup-access-token';
    private cordovaMeetupClientId = 'n91gkbjmld10pjvn6eqctu0llb';
    private browserMeetupClientId = 'j3fc3fgc175tt820cr4j2jmhlq';
    private oauth: OauthCordova | OauthBrowser;
    private meetupProvider: Meetup;

    constructor(
        public http: HttpClient,
        public httpNative: HTTP,
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
            this.meetupProvider = new Meetup({ clientId: this.cordovaMeetupClientId });

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
        let headers = {
            'Authorization': `Bearer ' ${this.accessToken}`,
            'Content-Type': 'application/json'
        };


        return this.httpNative.get(`${this.baseUrl}/2/member/self/`, {}, headers)
            .then(res => JSON.parse(res.data));
    }

    getCurrentUserInfo() {
        let memberV3Url = `${this.baseUrl}/members/self/?access_token=${this.accessToken}`;

        console.log(memberV3Url);

        return this.http.get(memberV3Url);
    }

    rsvp(eventId, response) {
        let headers = new HttpHeaders();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?response=${response}&access_token=${this.accessToken}`;

        let payload = { response };
        return this.http.post(rsvpV3Url, payload, { headers: headers })
            .map(res => res);
    }

    checkRSVP(eventId, userId) {
        let headers = new HttpHeaders();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?&access_token=${this.accessToken}`;
        console.log('checking rsvp for ', eventId);
        return this.http.get(rsvpV3Url, { headers: headers }).map((res: any) => {
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

                this.oauth.logInVia(this.meetupProvider).then((success: any) => {
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
