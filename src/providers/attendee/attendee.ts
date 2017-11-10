import { Injectable } from '@angular/core';

/*
  Generated class for the AttendeeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AttendeeProvider {

    private attendees = [
        {
            name: 'Myke Bates',
            description: 'Full Stack Dev',
            checkInTime: '1m',
            profileImg: 'assets/imgs/profile.jpg'
        },
        {
            name: 'Levi Zitting',
            description: 'Front End Dev',
            checkInTime: '4m',
            profileImg: 'assets/imgs/profile.jpg'
        },
        {
            name: 'John Doe',
            description: 'Back End Dev',
            checkInTime: '10m',
            profileImg: 'assets/imgs/profile.jpg'
        }
    ];

    constructor() {
    }

    getAttendees() {
        return this.attendees;
    }

}
