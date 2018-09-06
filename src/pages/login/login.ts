import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { HomePage } from "../home/home";
import { Storage } from '@ionic/storage';
import { MeetupApi } from "../../providers/authentication/meetup-api.service";
import { HttpClient } from "@angular/common/http";


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
export class LoginPage {
    loginChange: any;
    isApp: boolean;
    token: string;
    terms = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public plt: Platform,
        public storage: Storage,
        public meetupApi: MeetupApi,
        public http: HttpClient,
        public alertCtrl: AlertController
    ) {

        this.meetupApi.getAccessToken().then(val => {
            if(!val) return;

            this.navigateToHome();
        });
    }

    showGiveAwayAlert() {
        let message = "The rules are simple. Check-in to enter and be physically present during winner selection. "
            + "Prizes are from affiliates and sponsors of SGF Web Devs "
            + "- Apple is not involved in any way with giveaways.";

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

    navigateToHome() {
        this.navCtrl.setRoot(HomePage);
    }

    ionViewDidLoad() {
        if (this.plt.is('core') || this.plt.is('mobileweb')) {
            this.isApp = false;
        } else {
            this.isApp = true;
        }
    }

    loginOverride() {
        this.meetupApi.browserTokenOverride(this.token).then(() => {
            this.navCtrl.setRoot(HomePage);
        });
    }

    clearLocal() {
        this.storage.clear();
    }

    login() {
        this.meetupApi.login().then(success => {
            this.navigateToHome();
        }).catch(error => {
            console.log('login page', error)
        })
    }
}
