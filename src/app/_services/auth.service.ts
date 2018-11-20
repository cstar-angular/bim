import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      })
    })
  }

  doLinkedinLogin(){
    
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        let user:any = firebase.auth().currentUser;
        console.log(user);

        if ( user.emailVerified == false ) {
          this.sendEmailVerification();
        }

        resolve(res);
      }, err => reject(err))
    })
  }

  doSignin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword (value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  sendEmailVerification() {
    let user:any = firebase.auth().currentUser;
    return new Promise<any>((resolve, reject) => {
      user.sendEmailVerification().then(
        (success) => {
          console.log("please verify your email");
          resolve(success);
        } 
      ).catch(
        (err) => {
          reject(err)
        }
      )
    })    
  }
}
