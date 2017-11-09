import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    attendees = [
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
        }
    ]

    constructor(public navCtrl: NavController) {

    }

}
