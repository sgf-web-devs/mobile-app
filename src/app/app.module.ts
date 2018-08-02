import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { CheckInPage } from '../pages/check-in/check-in';
import { AttendeeListItemComponent } from "../components/attendee-list-item/attendee-list-item";
import { MeetupLoginButtonComponent } from '../components/meetup-login-button/meetup-login-button';
import { AttendeeProvider } from '../providers/attendee/attendee';
import { PreCheckinPage } from '../pages/pre-checkin/pre-checkin';
import { MeetupApi } from "../providers/authentication/meetup-api.service";
import { WebDevsApi } from "../providers/webdevs/web-devs-api.service";

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
        HttpClientModule,
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
        InAppBrowser,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AttendeeProvider,
    ]
})
export class AppModule { }
