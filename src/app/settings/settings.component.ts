import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../_services/auth.service';
import { UserProfile } from '../user/profile';
import { map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  activeTab = 'Profile';
  authUser: firebase.User;
  uid;
  userProfile = new UserProfile();
  @ViewChild('images_for_profile') images_for_profile: ElementRef;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private auth: AngularFireAuth ,
    private authService: AuthService,
    private afStorage: AngularFireStorage
  ) {
    this.authUser = auth.auth.currentUser;
    this.userProfile.email = this.authUser.email;
    // this.userProfile.phone = this.authUser.phoneNumber;
    this.userProfile.avatar = this.authUser.photoURL;
    this.userProfile.uid = this.authUser.uid
    this.uid = this.authUser.uid;

    this.authService.getUserById(this.uid).valueChanges().subscribe(data => {
      this.userProfile.name = data['name'];
      this.userProfile.company_name = data['company_name'];
      this.userProfile.phone = data['phone'];
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  updateProfile() {
    this.authUser.updateEmail(this.userProfile.email).then(function() {
      console.log('success');
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });

    this.authUser.updateProfile({
      displayName: "Jane Q. User",
      photoURL: this.userProfile.avatar
    }).then(function() {
      // Update successful.
      console.log('avartar change success');
      
    }).catch(function(error) {
      // An error happened.
      console.log('avartar change error');
    });

    this.authService.updateUserById(this.userProfile.uid, this.userProfile);
  }

  popupforImage() {
    this.images_for_profile.nativeElement.click();
  }

  deleteProfileImage() {
    this.userProfile.avatar = '';
  }

  handleFileInput(files) {
    if (files.length == 0) {
      return;
    }
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('profile/' + this.userProfile.uid+'/'+ '/'+id);
    this.task = this.ref.put(files[0]);
    var me = this;
    this.task.then(function (data) {
      
      var a = data.ref.getDownloadURL();
      a.then(function (data) {
       me.userProfile.avatar = data;
       console.log(data);
       
      });
    });   
  }

}
