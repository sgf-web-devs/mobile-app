import { Component, OnInit } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    Platform
} from 'ionic-angular';

import { HomePage } from "../home/home";
import { Storage } from '@ionic/storage';

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


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public plt: Platform,
        public storage: Storage
    ) { }

    ngOnInit() {
        this.storage.get('user').then((user) => {
            if(user) {
                this.navCtrl.push(HomePage);
            }
        });

        // this.loginChange = this.auth.getLoginChangeEmitter()
        //     .subscribe(user => this.onLoginChange(user));
    }

    onLoginChange(user:any){
        if(user){
            this.navCtrl.setRoot(HomePage).then(() =>{});
            //this.navCtrl.push(HomePage);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    login(){
        //this.auth.login();

        // This needs to happen after actually authenticating
        this.storage.set('user', 'true');
        this.storage.set('user_name', 'Myke Bates');
        this.storage.set('user_email', 'contact@mykebates.com');
        this.storage.set('user_image', 'https://s.gravatar.com/avatar/772eaa7ff6cd8dc6fb1b1f27b6bad71d?s=500');
        this.navCtrl.setRoot(HomePage).then(() =>{});
    }
}
