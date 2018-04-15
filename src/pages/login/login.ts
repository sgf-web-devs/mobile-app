import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, LoadingController} from 'ionic-angular';

import { HomePage } from "../home/home";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { Storage } from '@ionic/storage';
import { Meetup } from "../../providers/authentication/meetup";


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

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private auth: AuthenticationProvider,
        public plt: Platform,
        public storage: Storage,
        public meetup: Meetup,
    ) {

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

    onLoginChange(user:any){
        if(user){
            console.log(JSON.stringify(this.auth.user.displayName));
            this.navCtrl.setRoot(HomePage).then(() =>{});
            //this.navCtrl.push(HomePage);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');

        if(this.plt.is('core') || this.plt.is('mobileweb')) {
            this.isApp = false;
        } else {
            this.isApp = true;
        }
    }

    loginOverride(){
        this.meetup.browserTokenOverride(this.token).then(()=>{
            this.navCtrl.setRoot(HomePage);
        });
    }

    clearLocal(){
        this.storage.clear();
    }

    login(){
        if(this.isApp){
            this.meetup.login().then((success) => {
                this.navCtrl.setRoot(HomePage);
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
