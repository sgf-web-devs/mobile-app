import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import 'rxjs/add/operator/map';
import { HTTP } from '@ionic-native/http';
import { Platform } from "ionic-angular";
import { Meetup } from "ng2-cordova-oauth/core";
import { OauthBrowser } from "ng2-cordova-oauth/platform/browser";
import { OauthCordova } from "ng2-cordova-oauth/platform/cordova";


@Injectable()
export class MeetupApi {
    accessToken: any;
    clientId: any;
    redirectURI: any;
    url: any;
    browserClientId: any;
    browserRedirectURI: any;
    browserUrl: any;
    baseUrl: 'https://api.meetup.com';
    private cordovaMeetupClientId = 'n91gkbjmld10pjvn6eqctu0llb';
    private browserMeetupClientId = 'j3fc3fgc175tt820cr4j2jmhlq';
    private oauth: OauthCordova | OauthBrowser;
    private meetupProvider: Meetup;

    constructor(
        public http: Http,
        public httpNative: HTTP,
        public iab: InAppBrowser,
        private platform: Platform
    ) {
        let clientId = '';
        if(this.platform.is('core') || this.platform.is('mobileweb')) {
            this.oauth = new OauthBrowser();
            clientId = this.browserMeetupClientId;
        } else {
            this.oauth = new OauthCordova();
            clientId = this.cordovaMeetupClientId;
        }

        this.meetupProvider = new Meetup({ clientId });
    }

    setAccessToken(token) {
        this.accessToken = token;
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

        //return this.httpNative.get(memberV3Url, {}, {}).then(res=>res);

        return new Promise(resolve => {
            this.httpNative.get(memberV3Url, {}, {}).then(res => {
                resolve(JSON.parse(res.data));
            });
        })
    }

    rsvp(eventId, response) {
        let headers = new Headers();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?response=${response}&access_token=${this.accessToken}`;

        let payload = { response };
        return this.http.post(rsvpV3Url, payload, { headers: headers })
            .map(res => res);
    }

    checkRSVP(eventId, userId) {
        let headers = new Headers();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?&access_token=${this.accessToken}`;
        console.log('checking rsvp for ', eventId);
        return this.http.get(rsvpV3Url, { headers: headers }).map(res => {
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
            this.httpNative.get(eventsV3Url, {}, {}).then(res => {
                let events = JSON.parse(res.data);

                for (let event of events) {
                    if (event.status != 'past') {
                        resolve(event);
                        //console.log('events loop:', events);
                    }
                }

                console.log('events array', JSON.stringify(events[0]));
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
            try {
                this.platform.ready().then(() => {
                    this.oauth.logInVia(this.meetupProvider).then((success: any) => {
                        this.accessToken = success.access_token;
                        resolve(success);
                    })
                    .catch(error => {
                        console.log('loginVia error', error);
                        reject(error);
                    });
                });
            } catch(err) {
                console.log(err);
                reject(err);
            }
        });


    }
}
