import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { CheckInPage } from './../pages/check-in/check-in';
import { Geolocation } from '@ionic-native/geolocation';
import { AttendeeListItemComponent } from "../components/attendee-list-item/attendee-list-item";
import { MeetupLoginButtonComponent } from './../components/meetup-login-button/meetup-login-button';
import { AttendeeProvider } from '../providers/attendee/attendee';
import { PreCheckinPage } from '../pages/pre-checkin/pre-checkin';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { HttpClientModule } from "@angular/common/http";
import { JsonpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MeetupApi } from "../providers/authentication/meetup-api.service";
import { WebDevsApi } from "../providers/webdevs/web-devs-api.service";
import {HTTP} from "@ionic-native/http";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        CheckInPage,
        PreCheckinPage,
        AttendeeListItemComponent,
        MeetupLoginButtonComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        //HTTP,
        JsonpModule,
        AngularFireModule.initializeApp(environment.firebase, 'sgf-web-devs-api'),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        CheckInPage,
        PreCheckinPage,
        MeetupLoginButtonComponent
    ],
    providers: [
        MeetupApi,
        WebDevsApi,
        StatusBar,
        SplashScreen,
        Geolocation,
        HTTP,
        InAppBrowser,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AttendeeProvider,
        AuthenticationProvider
    ]
})
export class AppModule {
}
