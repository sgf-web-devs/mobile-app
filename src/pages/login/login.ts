import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { HomePage } from "../home/home";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { Storage } from '@ionic/storage';
import { Meetup } from "../../providers/authentication/meetup";
import { Http } from "@angular/http";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
    loginChange: any;
    isApp: boolean;
    token: string;
    terms: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private auth: AuthenticationProvider,
        public plt: Platform,
        public storage: Storage,
        public meetup: Meetup,
        public http: Http,
        public alertCtrl: AlertController
    ) {
        this.terms = true;
    }

    ngOnInit() {
        // this.storage.get('user').then((user) => {
        //     if(user) {
        //         this.navCtrl.push(HomePage);
        //     }
        // });

        // this.loginChange = this.auth.getLoginChangeEmitter()
        //     .subscribe(user => this.onLoginChange(user));
    }

    doAlert() {
        var message = "The rules are simple. Check-in to enter and be physically present during winner selection. Prizes are from affiliates and sponsors of SGF Web Devs - Apple is not involved in any way with giveaways.";

        if (this.plt.is('android')) {
            message = message.replace('Apple', 'Google');
        }

        let alert = this.alertCtrl.create({
            title: 'Giveaway Rules',
            subTitle: message,
            buttons: ['Ok']
        });

        alert.present();
    }

    onLoginChange(user: any) {
        if (user) {
            console.log(JSON.stringify(this.auth.user.displayName));
            this.navCtrl.setRoot(HomePage).then(() => {
            });
            //this.navCtrl.push(HomePage);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');

        if (this.plt.is('core') || this.plt.is('mobileweb')) {
            this.isApp = false;
        } else {
            this.isApp = true;
        }
    }

    loginOverride() {
        this.meetup.browserTokenOverride(this.token).then(() => {
            this.navCtrl.setRoot(HomePage);
        });
    }

    clearLocal() {
        this.storage.clear();
    }

    login() {
        if (this.isApp) {
            this.meetup.login().then((success) => {
                let successToken = success.toString().split('=')[1].split('&')[0];
                if (successToken) {
                    this.meetup.accessToken = successToken;
                    this.navCtrl.setRoot(HomePage);
                }
                //this.navCtrl.setRoot(HomePage);
            }, (err) => {
                console.log(err);
            })
        } else {
            this.meetup.browserLogin();
        }

        //this.auth.login();

        // const client_id = 'mabrcd406k0hhhe6gms84lfaq0';
        // const redirect_url = 'http://sgf-web-devs-staging.glitchedmob.com/api/meetup-oauth';
        //
        // const browser = this.iab.create(`https://secure.meetup.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_url}`);
        // browser.on('exit').subscribe(event => console.log(event));


        // This needs to happen after actually authenticating
        // this.storage.set('user', 'true');
        // this.storage.set('user_name', 'Myke Bates');
        // this.storage.set('user_email', 'contact@mykebates.com');
        // this.storage.set('user_image', 'https://s.gravatar.com/avatar/772eaa7ff6cd8dc6fb1b1f27b6bad71d?s=500');
        // this.navCtrl.setRoot(HomePage).then(() =>{});
    }
}
