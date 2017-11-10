import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AttendeeProvider } from './../../providers/attendee/attendee';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    attendees: any;

    constructor(
        public navCtrl: NavController,
        private attendeeProvier: AttendeeProvider
    ) { }

    ngOnInit() {
        this.attendees = this.attendeeProvier.getAttendees();
    }
}
