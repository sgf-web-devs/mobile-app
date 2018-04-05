import { Component } from '@angular/core';

/**
 * Generated class for the MeetupLoginButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'meetup-login-button',
  templateUrl: 'meetup-login-button.html'
})
export class MeetupLoginButtonComponent {

  text: string;

  constructor() {
    console.log('Hello MeetupLoginButtonComponent Component');
    this.text = 'Hello World';
  }

}
