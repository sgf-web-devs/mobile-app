import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { CheckInPage } from './../pages/check-in/check-in';
import { AttendeeListItemComponent } from "../components/attendee-list-item/attendee-list-item";
import { AttendeeProvider } from '../providers/attendee/attendee';
import { PreCheckinPage } from '../pages/pre-checkin/pre-checkin';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        CheckInPage,
        PreCheckinPage,
        AttendeeListItemComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        CheckInPage,
        PreCheckinPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
    AttendeeProvider
    ]
})
export class AppModule {
}
