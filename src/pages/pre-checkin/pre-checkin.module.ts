import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreCheckinPage } from './pre-checkin';

@NgModule({
  declarations: [
    PreCheckinPage,
  ],
  imports: [
    IonicPageModule.forChild(PreCheckinPage),
  ],
})
export class PreCheckinPageModule {}
