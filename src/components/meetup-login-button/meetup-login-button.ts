import { Component } from '@angular/core';


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
