import {NgModule} from '@angular/core';
import {IonicPageModule, Platform} from 'ionic-angular';
import {LoginPage} from './login';
import {StatusBar} from "@ionic-native/status-bar";

@NgModule({
    declarations: [
        LoginPage,
    ],
    imports: [
        IonicPageModule.forChild(LoginPage),
    ]
})
export class LoginPageModule {
    constructor(platform: Platform, statusBar: StatusBar) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //statusBar.hide();
        });
        //statusBar.hide();
        //this.statusBar.hide();
        //this.statusBar.overlaysWebView(false);
    }


}
