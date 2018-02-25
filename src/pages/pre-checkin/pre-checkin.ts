import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';


/**
 * Generated class for the PreCheckinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-pre-checkin',
    templateUrl: 'pre-checkin.html',
})
export class PreCheckinPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PreCheckinPage');
    }
}
