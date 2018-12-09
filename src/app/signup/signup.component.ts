import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router'
import { AuthService } from '../_services/auth.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiService } from '../_services/api.service';
import { DatabaseService } from '../_services/database.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorMessage = "";
  successMessage = "";

  user = {
    name: '',
    cname: '',
    email: '',
    password: '',
    phone: '',
    avatar: ''
  };

  projectId;
  teamId;
  teamInfo;
  
  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,    
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private databaseService: DatabaseService,
    private apiService: ApiService,
    private afAuth: AngularFireAuth
  ) { 
      // if (localStorage.getItem('currentUser') !== 'undefined' && localStorage.getItem('currentUser') !== null) {
      //   this.router.navigate(['/']);
      // }
      
      this.matIconRegistry.addSvgIcon(
        'google-plus',
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/google-plus.svg")
      );
      this.matIconRegistry.addSvgIcon(
        'linkedin',
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/linkedin.svg")
      );

      this.projectId = this.activedRoute.snapshot.params['pid'];
      this.teamId = this.activedRoute.snapshot.params['teamid'];

      if(this.projectId && this.teamId) {
        this.apiService.sendRequest('getTeamMemberInfo', {project: this.projectId, teamid: this.teamId}).subscribe((data: any) => {
          if (data.data) {
            this.teamInfo = data.data;
            this.user.name = data.data.name;
            this.user.cname = data.data.company;
            this.user.email = data.data.email;
          }
        });
      }
    }

  ngOnInit() {
  }

  gotoSignIn() {
    this.router.navigate(["/signin"]);
  }

  tryRegister() {
    this.authService.doRegister(this.user)
    .then(res => {
      this.errorMessage = "";
      this.successMessage = "Your account has been created";

      if(this.projectId && this.teamId) {
        if(this.teamInfo) {
          this.teamInfo.userid = this.afAuth.auth.currentUser.uid;
          this.databaseService.updateRow('/teams/' + this.projectId, this.teamId, this.teamInfo);
          this.databaseService.createRow('/user-project', {userid: this.teamInfo.userid, projectid: this.projectId});
        }
      }
      
      this.router.navigate(['/']);
    }, err => {
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }

  tryGoogleLogin(){
    this.authService.doGoogleLogin()
    .then(res =>{
      this.router.navigate(['/']);
    }, err => console.log(err)
    )
  }
}

export interface UserProfile {
  name: string;
  cname: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
}