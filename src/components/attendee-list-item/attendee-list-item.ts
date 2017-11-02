import { Component } from '@angular/core';

/**
 * Generated class for the AttendeeListItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'attendee-list-item',
  templateUrl: 'attendee-list-item.html'
})
export class AttendeeListItemComponent {

  name: string;
  description: string;
  checkInTime: string;
  profileImg: string;

  constructor() {
    this.name = 'Myke Bates';
    this.description = 'Full Stack Dev'
    this.checkInTime = '1m';
    this.profileImg = 'assets/imgs/profile.jpg'
  }

}
