import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import { AuthService } from '../_services/auth.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  errorMessage = "";
  successMessage = "";

  user = {email: '', password: ''};
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { 
    if (localStorage.getItem('currentUser') !== 'undefined' && localStorage.getItem('currentUser') !== null) {
      this.router.navigate(['/']);
    }

    this.matIconRegistry.addSvgIcon(
      'google-plus',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/google-plus.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/linkedin.svg")
    );
  }

  ngOnInit() {
  }

  gotoSignin() {
    this.router.navigate(["/signup"]);
  }

  gotoForgotPassword() {
    this.router.navigate(["/forgetpassword"]);
  }

  login(){
    this.authService.doSignin(this.user)
    .then(res => {
      this.errorMessage = "";

      localStorage.setItem('currentUser', res.user.uid);
      this.router.navigate(['/']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
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
