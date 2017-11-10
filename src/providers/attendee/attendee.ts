import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
/*
  Generated class for the AttendeeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
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

    constructor() {
    }

    getAttendees() {
        return of(this.attendees);
    }

}
