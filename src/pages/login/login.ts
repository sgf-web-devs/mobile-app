import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { HomePage } from "../home/home";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    login() {
        var provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('read:user');
        var _self = this;
        this.afAuth.auth.signInWithPopup(provider).then(function(result) {
            console.log(result);
            // This gives you a GitHub Access Token.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            _self.navCtrl.setRoot(HomePage).then(() =>{});
        });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

}
