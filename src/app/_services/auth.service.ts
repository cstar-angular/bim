import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { DatabaseService } from './database.service';
import { UserProfile } from '../user/profile';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isSignedInStream: Observable<boolean>;
  
  constructor(public afAuth: AngularFireAuth, private databaseService: DatabaseService) {
    this.afAuth.authState.subscribe((user: firebase.User) => {
      if(user) {
        
      }else {
       
      }
    });
    this.isSignedInStream = this.afAuth.authState.pipe(
      map<firebase.User, boolean>((user: firebase.User) => {
        return user != null;
      })
    );
  }

 

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
        
        var userProfile: UserProfile = {uid: user.uid, name: value.name, company_name: value.cname, email: value.email};

        this.databaseService.createRowWithKey('/users/'+user.uid, userProfile);

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
          resolve(success);
        } 
      ).catch(
        (err) => {
          reject(err)
        }
      )
    })    
  }

  getUserProfile(): any {
    return this.databaseService.getRowDetails('/users', firebase.auth().currentUser.uid);
  }

  isAuth() {
    if(firebase.auth().currentUser) {
      return true;
    } 
    return false;
  }

}
