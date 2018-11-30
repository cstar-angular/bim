import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { DatabaseService } from './database.service';
import { UserProfile } from '../user/profile';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isSignedInStream: Observable<boolean>;
  authUser;
  userName;
  private dbPath = "/users";
  dbRef: AngularFireList<any> = null;
  constructor(
    public afAuth: AngularFireAuth, 
    private databaseService: DatabaseService,
    private db: AngularFireDatabase) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.authUser = auth;
      }
    });
    
    this.isSignedInStream = this.afAuth.authState.pipe(
      map<firebase.User, boolean>((user: firebase.User) => {
        return user != null;
      })
    );
  }

  getAuthUser() {
    return this.authUser;
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

  getUserProfile() {
    return this.databaseService.getRowDetails('/users', firebase.auth().currentUser.uid);
  }

  doSignout() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signOut()
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  getUserById(uid) {
    // return  this.db.list(this.dbPath+'/'+uid);
    return  this.db.object(this.dbPath + "/" + uid);
  }

  updateUserById(uid, profile) {
    return this.db.list(this.dbPath).update(uid, profile);
  }

  getAvartarImage(profile: UserProfile) {
    var return_val = {
      type: "",
      val: ""
    }
    if (profile.avatar && profile.avatar != "") {
      return_val.type = "image";
      return_val.val = profile.avatar;
      return return_val;
    }

    if(profile.name && profile.name != "") {
      var res = profile.name.split(" ");
      return_val.type = 'text';
      if(res.length >= 2) {
        return_val.val = res[0].charAt(0).toUpperCase() + res[1].charAt(0).toUpperCase();
      }
      else {
        return_val.val = profile.name.charAt(0).toUpperCase() + profile.name.charAt(1).toUpperCase();
      }
      return return_val;
    }

    return return_val;
  }
}
