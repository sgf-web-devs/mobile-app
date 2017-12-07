import { HttpClient } from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  public user: any;
  loginChange: EventEmitter<any> = new EventEmitter();


  constructor(public http: HttpClient, public afAuth: AngularFireAuth) {
    console.log('Hello AuthenticationProvider Provider');


      var _self = this;
      this.afAuth.auth.onAuthStateChanged(function(user) {
          if (user) {
              _self.user = _self.afAuth.auth.currentUser;
              _self.loginChange.next({data: _self.user});
          }
      })
  }

    getLoginChangeEmitter() {
        return this.loginChange;
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
            _self.user = result.user;

            console.log(_self.afAuth.auth.currentUser);

        });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

}
