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

    constructor(
        public navCtrl: NavController,
        private attendeeProvier: AttendeeProvider,
        public auth: AuthenticationProvider,
        private db: AngularFireDatabase,
        private http:HttpClient,
        private jsonp: Jsonp,
        private storage: Storage,
        public plt: Platform,
        private meetup: Meetup,
        private webdevs: WebDevs
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
        this.meetup.getCurrentUserInfo().then(userData => {
            this.currentUser = userData.json();
            console.log('current user: ', this.currentUser);
            this.checkRsvp();
        }).catch(()=>{
            console.log('error');
        });
    }

    checkRsvp(){
        if(this.latestMeetup && this.currentUser && !this.checkedIn){
            console.log('checking meetup rsvp');
            this.meetup.checkRSVP(this.latestMeetup.id, this.currentUser.id).subscribe(
                rsvpd => {
                    this.rsvpd = rsvpd;
                    console.log('rsvp:', rsvpd);
                },
                err => {
                    console.log('failed to determine rsvp');
                }
            )
        }
    }
    getLatestMeetup() {
        return this.meetup.getLatestEvent().subscribe(
            latestEvent => {
                console.log('latestEvent: ', latestEvent);
                this.latestMeetup = latestEvent
                this.checkRsvp();
            },
            err => {
                console.log(err);
            }
        );
    }

    checkIn(){
        this.webdevs.checkin(this.currentUser).subscribe(goodCheckIn => {
            console.log('check response:', goodCheckIn);
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
        let checkinOpen = meetupDate.getHours() - 1;

        if(today.getDay() == meetupDate.getDay() && today.getMonth() == meetupDate.getMonth()) {
            if(today.getHours() >= checkinOpen && today.getHours() <= checkinClose) {
                return true;
            }
        }

        return true;
    }

    rsvp(eventId){
        this.meetup.rsvp(eventId, "yes").subscribe(
            res => {
                this.rsvpd = true;
            },
            err => {
                console.log('failed to rsvp');
            }
        );
    }

    cancelRsvp(eventId){
        this.meetup.rsvp(eventId,"no").subscribe(
            res => {
                this.rsvpd = false;
            },
            err => {
                console.log('failed to cancel rsvp');
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
        if(this.latestMeetup && !this.allowedToCheckin() && !this.checkCheckIn && this.rsvpd){
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
