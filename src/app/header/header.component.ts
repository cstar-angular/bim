import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SettingsComponent } from '../settings/settings.component'
import { AuthService } from '../_services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  url = '';
  isAuth: boolean;
  authUser;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
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
