import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import Pusher from 'pusher-js';

import { environment } from "../../environments/environment";


/*
  Generated class for the AttendeeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AttendeeProvider {

    private baseUrl = environment.webDevs.baseUrl;

    constructor(
        public http: HttpClient
    ) {
    }

    public getAttendees() {
        return this.http.get(`${this.baseUrl}/api/attendees`);
    }

    public liveAttendees(): Observable<any> {
        const pusher = new Pusher(environment.pusher.appKey, {
            cluster: environment.pusher.cluster,
            encrypted: true
        });

        const channel = pusher.subscribe('attendees');

        return Observable.create(observer => {
            channel.bind('new-checkin', (attendee: any) => observer.next(attendee));
        });
    }

}
