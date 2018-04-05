import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/catch';

@Injectable()
export class Meetup {
    accessToken: any;
    clientId: any;
    redirectURI: any;
    url: any;

    constructor(public http: Http, public iab: InAppBrowser) {

        //OAuth
        this.clientId = 'mabrcd406k0hhhe6gms84lfaq0';
        this.redirectURI = 'http://localhost';
        this.url = 'https://secure.meetup.com/oauth2/authorize?client_id=' + this.clientId + '&response_type=token&redirect_uri=' + this.redirectURI;
    }

    setAccessToken(token) {
        this.accessToken = token;
    }

    getUserInfo(){
        let headers = new Headers();

        headers.append('Authorization', 'Bearer ' + this.accessToken);
        headers.append('Content-Type', 'application/json');

        return this.http.post('https://api.meetup.com/2/profile/17707082/self', "null", {headers: headers}).map(res => res.json());
    }

    login(){
        return new Promise((resolve, reject) => {

            let browser = this.iab.create(this.url, '_blank');

            let listener = browser.on('loadstart').subscribe((event: any) => {

                if(event.url.indexOf('login') > -1){
                    return;
                }

                if(event.url.indexOf('https://facebook.com') > -1 ){
                    return;
                }

                if(event.url.indexOf('https://www.facebook.com') > -1 ){
                    return;
                }

                if(event.url.indexOf('https://m.facebook.com/v2.6') > -1 ){
                    return;
                }

                //Ignore the Meetup authorize screen
                if(event.url.indexOf('https://secure.meetup.com/oauth2/authorize') > -1){
                    return;
                }

                if(event.url.indexOf('http://localhost/#error') > -1 ){
                    browser.close();
                    alert('Could not authenticate');
                    reject('Could not authenticate');
                }

                //Check the redirect uri
                if(event.url.indexOf(this.redirectURI) > -1 ){
                    listener.unsubscribe();
                    browser.close();
                    let token = event.url.split('=')[1].split('&')[0];
                    this.accessToken = token;
                    resolve(event.url);
                    this.getUserInfo()
                } else {
                    alert("Could not authenticate");
                    reject("Could not authenticate");
                }
            });
        });
    }
}
