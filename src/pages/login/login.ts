import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from "../home/home";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

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


    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthenticationProvider) {
    }

    ngOnInit(){
        this.loginChange = this.auth.getLoginChangeEmitter()
            .subscribe(user => this.onLoginChange(user));
    }

    onLoginChange(user:any){
        if(user){
            console.log(JSON.stringify(this.auth.user.displayName));
            this.navCtrl.setRoot(HomePage).then(() =>{});

        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    login(){
        this.auth.login();
    }


}
