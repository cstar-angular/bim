import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import { AuthService } from '../_services/auth.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

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

  gotoSignIn() {
    this.router.navigate(["/signin"]);
  }

  tryRegister() {
    this.authService.doRegister(this.user)
    .then(res => {
      this.errorMessage = "";
      this.successMessage = "Your account has been created";

      localStorage.setItem('currentUser', res.user.uid);
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
