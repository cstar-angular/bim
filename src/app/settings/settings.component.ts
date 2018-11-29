import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../_services/auth.service';
import { UserProfile } from '../user/profile';
import { map } from 'rxjs/operators';

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

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private auth: AngularFireAuth ,
    private authService: AuthService
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

    this.authService.updateUserById(this.userProfile.uid, this.userProfile);
  }
}
