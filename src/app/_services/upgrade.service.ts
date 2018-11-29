import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {

  constructor(
    public afAuth: AngularFireAuth
  ) { 
    let user:any = firebase.auth().currentUser;
  }

  getAuth() {
    let user:any = firebase.auth().currentUser;
  }
}
