import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = LoginPage;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen
    ) {
        this.platform.ready().then(() => {
            this.splashScreen.hide();
        });
    }
}

