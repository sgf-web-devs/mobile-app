import { Component, OnInit } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { CheckInPage } from './../check-in/check-in';
import { AttendeeProvider } from './../../providers/attendee/attendee';
import { PreCheckinPage } from '../pre-checkin/pre-checkin';
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import { AngularFireDatabase } from 'angularfire2/database';
import { Jsonp } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    attendees: any;
    checkInPage = CheckInPage;
    items: any;
    latestMeetup: any;
    checkedIn: boolean;
    showMore: boolean;

    constructor(
        public navCtrl: NavController,
        private attendeeProvier: AttendeeProvider,
        public auth: AuthenticationProvider,
        private db: AngularFireDatabase,
        private http:HttpClient,
        private jsonp: Jsonp,
        private storage: Storage,
        public plt: Platform
    ) {
        this.checkedIn = false;
        this.items = db.list('user').valueChanges();

        this.getLatestMeetup();
        this.checkCheckIn();
        this.initPushNotifications();
    }


    ngOnInit() {
        this.attendeeProvier.getAttendees().subscribe(
            attendees => this.attendees = attendees,
        );
    }

    getLatestMeetup() {
        return this.queryMeetup().subscribe(
            data => {
                if(data.data[0]) {
                    this.latestMeetup = data.data[0];
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    checkIn(){
        this.checkinCall().subscribe(goodCheckIn => {
            if(goodCheckIn) {
                this.checkedIn = true;
                this.cacheCheckin();
            }
        });
    }


    queryMeetup() {
        let url = 'https://api.meetup.com/SGF-Web-Devs/events?scroll=next_upcoming&photo-host=public&page=1&sig_id=28541422&sig=71b4eb87e5e64e8f1dd28c65cc1b01ff71dd0828&callback=JSONP_CALLBACK';
        return this.jsonp.get(url).map(res => res.json());
    }

    toggleDescription(){
        this.showMore = !this.showMore;
    }
    // uggggh. whatever - Myke
    trimDescription(description) {
        let trimSpot = description.indexOf('<p>Pizza');

        if(trimSpot) {
            return description.substring(0, trimSpot);
        }

        return description;
    }

    // Probably just need to pull moment in at some point for other features, too - Myke
    formatDate(date) {
        var d = new Date(date);
        return d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear().toString().replace('20', '');
    }

    isCheckinTime(date) {
        let today = new Date();
        let meetupDate = new Date(date);

        if(today.getDay() == meetupDate.getDay() && today.getMonth() == meetupDate.getMonth()) {
            if(today.getHours() >= 17 && today.getHours() <= 20) {
                return true;
            }
        }

        //return false;
        return true;
    }

    openNextEventInBrowser(url) {
        window.open(url);
    }

    checkinCall() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post('http://demo9029555.mockable.io/checkin', { 'value1': 'yep' }, httpOptions).map((res: Response) => res);
        //return this.http.post('http://sgf-web-devs-staging.glitchedmob.com/api/checkin', { 'value1': 'yep' }, httpOptions).map((res: Response) => res);
    }

    allowedToCheckin() {
        if(this.latestMeetup && this.isCheckinTime(this.latestMeetup.local_date) && !this.checkedIn) {
            return true;
        }

        return false;
    }

    showRsvpLink() {
        if(this.latestMeetup && !this.allowedToCheckin() && !this.checkedIn) {
            return true;
        }

        return false;
    }

    cacheCheckin() {
        this.storage.set('checkin', this.today());
    }

    checkCheckIn() {
        this.storage.get('checkin').then((val) => {
            if(val == this.today()) {
                this.checkedIn = true;
            }

            if(val && val != this.today()) {
                this.storage.remove('checkin');
                this.checkedIn = false;
            }
        });

        return false;
    }

    today() {
        let today = new Date();
        return today.getMonth() + '/' + today.getDay() + '/' + today.getFullYear();
    }

    initPushNotifications() {
        let notificationOpenedCallback = function(jsonData) {
            alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        if(this.plt.is('android')) {
            window["plugins"].OneSignal
                .startInit("0b60a144-1ecf-4903-8c16-76bec9905e8f", "673684652707")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            // Placing this here for now...
            // Need to call this as soon as we get the users email address from auth routine
            //window["plugins"].OneSignal.sendTag('email', 'theuser@email.com');
        }

        if(this.plt.is('ios')) {
            window["plugins"].OneSignal
                .startInit("0b60a144-1ecf-4903-8c16-76bec9905e8f")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            // Placing this here for now...
            // Need to call this as soon as we get the users email address from auth routine
            //window["plugins"].OneSignal.sendTag('email', 'theuser@email.com');
        }
    }
}
