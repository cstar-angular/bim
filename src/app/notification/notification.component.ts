import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DatabaseService } from '../_services/database.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  isShow = false;
  userId;
  tablePath = '/notifications';
  notifications;
  badge = 0;
  isLoading = true;
  constructor(
    private afAuth: AngularFireAuth,
    private databaseService: DatabaseService
  ) { }
  

  ngOnInit() {
    this.userId = this.afAuth.auth.currentUser.uid;
    
    if (this.userId) {
      this.tablePath += '/' + this.userId;
    }

    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      this.isLoading = false;
     this.notifications = data;
     this.badge = 0;
     this.notifications.map(noti => {
       if(!noti.isread) {
         this.badge ++;
       }
     })
     
    });
  }

  toggle(){
    this.isShow = !this.isShow;
  }

  clear() {
    this.databaseService.deleteAll(this.tablePath);
  }
}
