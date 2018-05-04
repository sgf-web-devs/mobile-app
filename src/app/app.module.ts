import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AttendeeListItemComponent } from "../components/attendee-list-item/attendee-list-item";
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { PreCheckinPage } from '../pages/pre-checkin/pre-checkin';
import { AttendeeProvider } from '../providers/attendee/attendee';
import { MeetupLoginButtonComponent } from '../components/meetup-login-button/meetup-login-button';
import { CheckInPage } from '../pages/check-in/check-in';
import { MyApp } from './app.component';


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
        JsonpModule,
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
        StatusBar,
        SplashScreen,
        Geolocation,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AttendeeProvider,
    ]
})
export class AppModule {
}
