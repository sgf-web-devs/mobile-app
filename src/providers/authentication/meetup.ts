import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import {HomePage} from "../../pages/home/home";
//import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/catch';

@Injectable()
export class Meetup {
    accessToken: any;
    clientId: any;
    redirectURI: any;
    url: any;
    browserClientId: any;
    browserRedirectURI: any;
    browserUrl: any;
    baseUrl: string;

    constructor(public http: Http, public httpNative: HTTP, public iab: InAppBrowser) {
        //OAuth
        //this.clientId = 'mabrcd406k0hhhe6gms84lfaq0';
        this.clientId = 'n91gkbjmld10pjvn6eqctu0llb';
        this.redirectURI = 'http://localhost';
        this.url = 'https://secure.meetup.com/oauth2/authorize?scope=rsvp&client_id=' + this.clientId + '&response_type=token&redirect_uri=' + this.redirectURI;

        //Need these for running locally with only a web browser on port 8100
        this.browserClientId = 'j3fc3fgc175tt820cr4j2jmhlq';
        this.browserRedirectURI = 'http://localhost:8100';
        this.browserUrl = 'https://secure.meetup.com/oauth2/authorize?scope=rsvp&client_id=' + this.browserClientId + '&response_type=token&redirect_uri=' + this.browserRedirectURI;

        this.baseUrl = 'https://api.meetup.com';
    }

    setAccessToken(token) {
        this.accessToken = token;
    }

    getUserInfo() {
        let headers = {
            'Authorization': 'Bearer ' + this.accessToken,
            'Content-Type': 'application/json'
        };


        return this.httpNative.get(`${this.baseUrl}/2/member/self/`, {}, headers).then(res => JSON.parse(res.data));
    }

    getCurrentUserInfo(){
        let headers = new Headers();
        let memberV3Url = `${this.baseUrl}/members/self/?access_token=${this.accessToken}`;

        //return this.httpNative.get(memberV3Url, {}, {}).then(res=>res);

        return new Promise(resolve => {
            this.httpNative.get(memberV3Url, {}, {}).then(res=> {
                resolve(JSON.parse(res.data));
            });
        })
    }

    rsvp(eventId, response){
        let headers = new Headers();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?response=${response}&access_token=${this.accessToken}`;

        let payload = { response };
        return this.http.post(rsvpV3Url, payload, {headers: headers}).map(res => {
            return res;
        });
    }
    checkRSVP(eventId, userId){
        let headers = new Headers();
        let rsvpV3Url = `${this.baseUrl}/SGF-Web-Devs/events/${eventId}/rsvps?&access_token=${this.accessToken}`;
        console.log('checking rsvp for ', eventId);
        return this.http.get(rsvpV3Url, {headers: headers}).map(res => {
            let rsvps = res.json();
            for(let rsvp of rsvps){
                if(rsvp.member.id === userId){
                    return true;
                }
            }
            return false;
        });
    }
    getLatestEvent(){
        let headers = new Headers();
        let eventsV3Url = `${this.baseUrl}/SGF-Web-Devs/events?scroll=recent_past&access_token=${this.accessToken}`;

        return new Promise(resolve => {
            this.httpNative.get(eventsV3Url, {}, {}).then(res=> {
                let events = JSON.parse(res.data);

                for(let event of events){
                    if(event.status != 'past'){
                        resolve(event);
                        //console.log('events loop:', events);
                    }
                }

                console.log('events array', JSON.stringify(events[0]));
                resolve(events[0]);
            });
        })
    }

    browserTokenOverride(token: string){
        return new Promise((resolve,reject) => {
            if(token && token.length > 0){
                this.accessToken = token;
                resolve();
            } else {
                reject('invalid token');
            }
        });
    }

    browserLogin(){
        this.iab.create(this.browserUrl, '_blank');
    }

    login() {
        return new Promise((resolve, reject) => {

            let browser = this.iab.create(this.url, '_blank');

            let listener = browser.on('loadstart').subscribe((event: any) => {

                if (event.url.indexOf('login') > -1) {
                    return;
                }

                if (event.url.indexOf('https://facebook.com') > -1) {
                    return;
                }

                if (event.url.indexOf('https://www.facebook.com') > -1) {
                    return;
                }

                if (event.url.indexOf('https://m.facebook.com/v2.6') > -1) {
                    return;
                }

                //Ignore the Meetup authorize screen
                if (event.url.indexOf('https://secure.meetup.com/oauth2/authorize') > -1) {
                    return;
                }

                if (event.url.indexOf('http://localhost/#error') > -1) {
                    browser.close();
                    alert('Could not authenticate');
                    reject('Could not authenticate');
                }

                //Check the redirect uri
                if (event.url.indexOf(this.redirectURI) > -1) {
                    listener.unsubscribe();
                    browser.close();
                    console.log(event.url);
                    let token = event.url.split('=')[1].split('&')[0];
                    this.accessToken = token;
                    resolve(event.url);
                    this.getUserInfo();
                    //this.navCtrl.setRoot(HomePage);
                } else {
                    alert("Could not authenticate");
                    reject("Could not authenticate");
                }
            });
        });
    }
}