import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {
  user;
  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) { 
    this.user = firebase.auth().currentUser;
  }

  processPayment(token: any, amount, type) {
    const payment = {token , amount};
    const membership = {
      created: new Date().getTime(),
      type: type
    }
    this.db.list('/payments/'+this.user.uid).push(payment);
    this.db.list('users/' + this.user.uid ).set('membership',membership);
  }
}
