import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
import * as Pusher from 'pusher-js';

import { environment } from './../../environments/environment';

@Injectable()
export class AttendeeProvider {

    private attendees = [{
        "name": "Andria Fish",
        "description": "Full Stack Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Kimberly Wolseley",
        "description": "Full Stack Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Bettye Hardington",
        "description": "Full Stack Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Vergil MacFadzan",
        "description": "Back End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Sauncho Kremer",
        "description": "Full Stack Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Bartholomew Worster",
        "description": "Full Stack Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Hermann Byass",
        "description": "Front End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Bernie Moncey",
        "description": "Front End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Skippy Loudian",
        "description": "Front End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Mufi Sallenger",
        "description": "Full Stack Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Hank Enriques",
        "description": "Front End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Maressa Doudney",
        "description": "Full Stack Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Meier Otley",
        "description": "Back End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Adria Sotworth",
        "description": "Front End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }, {
        "name": "Thurstan Gerrans",
        "description": "Back End Dev",
        "checkInTime": "1m",
        "profileImg": "assets/imgs/profile.jpg"
    }];

    private pusher = new Pusher(environment.pusher.appKey, {
        cluster: environment.pusher.cluster,
        encrypted: environment.pusher.encrypted
    });

    constructor() {
    }

    getAttendees() {
        return of(this.attendees);
    }

    liveAttendees(): Observable<any> {
        const channel = this.pusher.subscribe('my-channel');

        return Observable.create(observer => {
            channel.bind('my-event', data => observer.next(data));
        });
    }

}
