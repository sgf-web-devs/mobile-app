import { Component, Input } from '@angular/core';
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

  @Input() attendee: any;

  constructor() { }

}
