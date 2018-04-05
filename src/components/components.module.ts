import { NgModule } from '@angular/core';
import { AttendeeListItemComponent } from './attendee-list-item/attendee-list-item';
import { MeetupLoginButtonComponent } from './meetup-login-button/meetup-login-button';
@NgModule({
	declarations: [AttendeeListItemComponent,
    MeetupLoginButtonComponent],
	imports: [],
	exports: [AttendeeListItemComponent,
    MeetupLoginButtonComponent]
})
export class ComponentsModule {}
