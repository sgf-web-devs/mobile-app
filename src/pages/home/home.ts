import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';


import { CheckInPage } from './../check-in/check-in';
import { AttendeeProvider } from './../../providers/attendee/attendee';
import { PreCheckinPage } from '../pre-checkin/pre-checkin';
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    attendees: any;

    checkIn = CheckInPage

    constructor(
        public navCtrl: NavController,
        private attendeeProvier: AttendeeProvider,
        public auth: AuthenticationProvider
    ) { }


    ngOnInit() {
        this.attendeeProvier.getAttendees().subscribe(
            attendees => this.attendees = attendees,
        );
    }
    showCheckIn(){
        //TODO if within time constraints
        //this.navCtrl.push(CheckInPage);
        //else
        this.navCtrl.push(PreCheckinPage);

    }
}
