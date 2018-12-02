import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-expired',
  templateUrl: './expired.component.html',
  styleUrls: ['./expired.component.scss']
})
export class ExpiredComponent implements OnInit {
  authUser;
  user;
  isLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) { 
    
  }

  ngOnInit() {
    this.authUser = this.afAuth.auth.currentUser;
    this.authService.getUserByIdPromise(this.authUser.uid).then(data => {
      this.isLoading = false;
      if(data) {
        this.user = data;
      }
    });
  }

  gotourl(url){
    this.router.navigate([url]);
  }
}
