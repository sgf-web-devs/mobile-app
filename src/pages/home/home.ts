import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map'
import { environment } from "../../environments/environment";
import { AttendeeProvider } from '../../providers/attendee/attendee';
import { CheckInPage } from '../check-in/check-in';
import { MeetupApi } from '../../providers/authentication/meetup-api.service';
import { WebDevsApi } from '../../providers/webdevs/web-devs-api.service';

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
    showMore: boolean;
    description: string;

    constructor(
        public navCtrl: NavController,
        private attendeeProvider: AttendeeProvider,
        private storage: Storage,
        public plt: Platform,
        private meetup: MeetupApi,
        private webdevs: WebDevsApi
    ) {
        this.checkedIn = false;
    }


    ngOnInit() {
        this.getLatestMeetup();
        this.checkCheckIn();

        this.attendeeProvider.getAttendees().subscribe(attendees => {
            this.attendees = attendees;
            this.attendeesListener();
        });

        this.meetup.getCurrentUserInfo().subscribe(userData => {
            this.currentUser = userData;
            this.initPushNotifications();
            //this.checkRsvp();
        }, err => {
            console.log('error getting User info', err);
        });

    }

    attendeesListener() {
        this.attendeeProvider.liveAttendees()
            .subscribe((attendee: any) => {
                this.attendees = [
                    {
                        id: attendee.id,
                        name: attendee.name,
                        image: attendee.image,
                    },
                    ...this.attendees,
                ];
            });
    }

    checkRsvp() {
        if (this.latestMeetup && this.currentUser && !this.checkedIn) {
            console.log('checking meetup rsvp');
            this.meetup.checkRSVP(this.latestMeetup.id, this.currentUser.id).subscribe(
                rsvpd => {
                    this.rsvpd = rsvpd;
                    console.log('rsvp:', rsvpd);
                },
                err => {
                    console.log('error determining rsvp', err);
                }
            )
        }
    }

    getLatestMeetup() {
        this.meetup.getLatestEvent().then(
            latestEvent => {
                console.log('latestEvent: ', latestEvent);
                this.latestMeetup = latestEvent;
                this.computeDescription(this.latestMeetup.description);
            },
            err => {
                console.log('error getting latest meetup info', err);
            }
        );
    }

    checkIn() {

        this.webdevs.checkin(this.currentUser).then(goodCheckIn => {
            console.log('check response:', goodCheckIn);
            if (goodCheckIn) {
                this.checkedIn = true;
                this.cacheCheckin();
            }
        });
    }

    toggleDescription() {
        this.showMore = !this.showMore;
        this.computeDescription(this.latestMeetup.description);
    }

    computeDescription(text) {
        if(!this.showMore) {
            const trimmed = this.htmlToPlaintext(text)
                .split(' ')
                .splice(0, 100)
                .join(' ');

            this.description = `<p>${trimmed}</p>`;
            return;
        }

        this.description = text;
        return;
    }

    htmlToPlaintext(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
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

        if (today.getDay() == meetupDate.getDay() && today.getMonth() == meetupDate.getMonth()) {
            if (today.getHours() >= checkinOpen && today.getHours() <= checkinClose) {
                return true;
            }
        }

        return false;
        //return true;
    }

    rsvp(eventId) {
        this.meetup.rsvp(eventId, "yes").subscribe(
            res => {
                this.rsvpd = true;
            },
            err => {
                console.log('error rsvping', err);
            }
        );
    }

    cancelRsvp(eventId) {
        this.meetup.rsvp(eventId, "no").subscribe(
            res => {
                this.rsvpd = false;
            },
            err => {
                console.log('error cancelling rsvp', err);
            }
        );
    }

    openNextEventInBrowser(url) {
        window.open(url);
    }

    allowedToCheckin() {
        if (this.latestMeetup && this.isCheckinTime(this.latestMeetup.time) && !this.checkedIn) {
            return true;
        }

        return false;
    }

    showRsvpLink() {
        if (this.latestMeetup && !this.allowedToCheckin() && !this.checkedIn && !this.rsvpd) {
            return true;
        }

        return false;
    }

    showCancelRsvp() {
        if (this.latestMeetup && !this.allowedToCheckin() && !this.checkedIn && this.rsvpd) {
            return true;
        }
        return false;
    }

    cacheCheckin() {
        this.storage.set('checkin', this.today());
    }

    checkCheckIn() {
        this.storage.get('checkin').then((val) => {
            if (val == this.today()) {
                this.checkedIn = true;
            }

            if (val && val != this.today()) {
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
        if (this.plt.is('core') || this.plt.is('mobileweb')) {
            return; //don't init if in browser
        }

        let notificationOpenedCallback = function (jsonData) {
            alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        if (this.plt.is('android')) {
            window["plugins"].OneSignal
                .startInit(environment.oneSignal.restApiKey, environment.oneSignal.appId)
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            window["plugins"].OneSignal.sendTag('email', this.currentUser.email);
        }

        if (this.plt.is('ios')) {
            window["plugins"].OneSignal
                .startInit(environment.oneSignal.restApiKey)
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            window["plugins"].OneSignal.sendTag('email', this.currentUser.email);
        }
    }
}
