import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SettingsComponent } from '../settings/settings.component'
import { AuthService } from '../_services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { UserProfile } from '../user/profile';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  url = '';
  isAuth: boolean;
  authUser;
  userProfile = new UserProfile();
  avartarImage = {
    type: '',
    val: ''
  }
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private auth: AngularFireAuth
  ) {
    this.router.events.subscribe((val) => {
      this.url = val['url'];
    });

    var me = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        me.isAuth = true;
      } else {
        me.isAuth = false;
      }
    });

    this.authUser = auth.auth.currentUser;
    this.userProfile.email = this.authUser.email;
    // this.userProfile.phone = this.authUser.phoneNumber;
    this.userProfile.avatar = this.authUser.photoURL;
    this.userProfile.uid = this.authUser.uid;

    this.authService.getUserById(this.userProfile.uid).valueChanges().subscribe(data => {
      this.userProfile.name = data['name'];
      this.userProfile.company_name = data['company_name'];
      this.userProfile.phone = data['phone'];

      this.avartarImage = this.authService.getAvartarImage(this.userProfile);
    });
  }

  ngOnInit() {
    
  }

  ngAfterViewChecked() {
   
  }

  gotourl(url){
    this.router.navigate([url]);
  }

  openDialog(): void {
    // 
    const dialogRef = this.dialog.open(SettingsComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  signout() {
    this.authService.doSignout().then(res => {
      this.router.navigate(['/signin'])
    }, err => {
      console.log(err);
    });
  }
}
