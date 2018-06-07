import { Component, OnInit } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { CheckInPage } from './../check-in/check-in';
import { AttendeeProvider } from './../../providers/attendee/attendee';
import { PreCheckinPage } from '../pre-checkin/pre-checkin';
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import { AngularFireDatabase } from 'angularfire2/database';
import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/map'
import { Storage } from '@ionic/storage';
import { Meetup } from '../../providers/authentication/meetup';
import { WebDevs } from '../../providers/webdevs/webdevs';

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
    currentUser: any;
    rsvpd: boolean;
    logs: string[];
    logging: boolean;

    constructor(
        public navCtrl: NavController,
        private attendeeProvier: AttendeeProvider,
        public auth: AuthenticationProvider,
        private db: AngularFireDatabase,
        private http:HTTP,
        private storage: Storage,
        public plt: Platform,
        private meetup: Meetup,
        private webdevs: WebDevs
    ) {
        this.logs = [];
        this.logging = false;
        this.checkedIn = false;
        this.items = db.list('user').valueChanges();

    }

    log(message, obj={}){
        if(this.logging){
            this.logs.push(`${message}: ${JSON.stringify(obj)}`);
        }

        console.log(message, obj);
    }

    ngOnInit() {
        this.currentUser = {
            name: 'Myke Bates',
            photo: 'assets/imgs/profile.jpg'
        };

        this.getLatestMeetup();
        this.checkCheckIn();
        this.initPushNotifications();

        this.attendeeProvier.getAttendees().subscribe(
            attendees => this.attendees = attendees,
        );
        this.meetup.getCurrentUserInfo().then(
            userData => {
                this.currentUser = userData;
                this.log('current user: ', this.currentUser);
                //this.checkRsvp();
            }, err => {
                this.log('error getting User info', err);
            });
    }



    checkRsvp(){
        if(this.latestMeetup && this.currentUser && !this.checkedIn){
            this.log('checking meetup rsvp');
            this.meetup.checkRSVP(this.latestMeetup.id, this.currentUser.id).subscribe(
                rsvpd => {
                    this.rsvpd = rsvpd;
                    this.log('rsvp:', rsvpd);
                },
                err => {
                    this.log('error determining rsvp', err);
                }
            )
        }
    }
    getLatestMeetup() {

        //let hey = this.meetup.getLatestEvent();
        //console.log(hey);
        //this.latestMeetup = hey;
        this.meetup.getLatestEvent().then(
            latestEvent => {
                this.log('latestEvent: ', latestEvent);
                this.latestMeetup = latestEvent;
                //this.checkRsvp();
            },
            err => {
                this.log('error getting latest meetup info', err);
            }
        );
    }

    checkIn(){
        console.log("checking in", 1);
        //let url = 'https://admin.sgfwebdevs.com/api/checkin';
        let url = "https://requestbin.fullcontact.com/15i80oe1";
        console.log("checking in", 2);
        let checkinData = {
            email: this.currentUser.email,
            name: this.currentUser.name,
            image: this.currentUser.photo.photo_link
        };
        console.log("checking in", 3);

        try{
            this.http.get(url, {}, {})
                .then(data => {

                    console.log(data.status);
                    console.log(data.data); // data received by server
                    console.log(data.headers);

                })
                .catch(error => {

                    console.log(error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);

                });
        } catch(e){
            console.log("checking in", e);
        }



        console.log("checking in", 5);

        this.webdevs.checkin(this.currentUser).then(goodCheckIn => {
            this.log('check response:', goodCheckIn);
            if(goodCheckIn) {
                this.checkedIn = true;
                this.cacheCheckin();
            }
        });
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
        return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear().toString().replace('20', '');
    }

    isCheckinTime(date) {
        let today = new Date();
        let meetupDate = new Date(date);
        let checkinClose = meetupDate.getHours() + 4;
        let checkinOpen = meetupDate.getHours() - 4;

        if(today.getDay() == meetupDate.getDay() && today.getMonth() == meetupDate.getMonth()) {
            if(today.getHours() >= checkinOpen && today.getHours() <= checkinClose) {
                return true;
            }
        }

        return false;
    }

    rsvp(eventId){
        this.meetup.rsvp(eventId, "yes").subscribe(
            res => {
                this.rsvpd = true;
            },
            err => {
                this.log('error rsvping', err);
            }
        );
    }

    cancelRsvp(eventId){
        this.meetup.rsvp(eventId,"no").subscribe(
            res => {
                this.rsvpd = false;
            },
            err => {
                this.log('error cancelling rsvp', err);
            }
        );
    }

    openNextEventInBrowser(url) {
        window.open(url);
    }

    allowedToCheckin() {
        if(this.latestMeetup && this.isCheckinTime(this.latestMeetup.time) && !this.checkedIn) {
            return true;
        }

        return false;
    }

    showRsvpLink() {
        if(this.latestMeetup && !this.allowedToCheckin() && !this.checkedIn && !this.rsvpd) {
            return true;
        }

        return false;
    }

    showCancelRsvp(){
        if(this.latestMeetup && !this.allowedToCheckin() && !this.checkedIn && this.rsvpd){
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
        if(this.plt.is('core') || this.plt.is('mobileweb')) {
            return; //don't init if in browser
        }

        let notificationOpenedCallback = function(jsonData) {
            alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        if(this.plt.is('android')) {
            window["plugins"].OneSignal
                .startInit("0b60a144-1ecf-4903-8c16-76bec9905e8f", "673684652707")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();
        }

        if(this.plt.is('ios')) {
            window["plugins"].OneSignal
                .startInit("0b60a144-1ecf-4903-8c16-76bec9905e8f")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();
        }
    }
}
