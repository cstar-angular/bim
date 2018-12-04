import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { DatabaseService } from '../../_services/database.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {

  @Input() notification;
  userProfile;
  
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    var now = new Date().getTime();
    console.log(now);
    
    var diff = now - this.notification.created;
    var diff1 = Math.floor(diff / 1000 / 3600 / 24);
    
    if (diff1 > 0) {
      this.notification['diff'] = diff1 + " days ago";
    } else {
      diff1 = Math.floor(diff / 1000 / 3600 );
      if (diff1 > 0) {
        this.notification['diff'] = diff1 + " hours ago";
      } else {
        diff1 = Math.floor(diff / 1000 / 60 );
        if (diff1 > 0) {
          this.notification['diff'] = diff1 + " minutes ago";
        } else {
          diff1 = Math.floor(diff / 1000 );
          this.notification['diff'] = diff1 + " seconds ago";
        }
      }
    }
    // this.notification['diff'] = diff;
    this.authService.getUserByIdPromise(this.notification.sender).then(data => {
      this.userProfile = data;
    });

    var curUser = this.afAuth.auth.currentUser;
    this.databaseService.updateRow('/notifications/' + curUser.uid, this.notification.key, {isread: true} );
  }

}
