import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import { AuthService } from '../_services/auth.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {

  user = {email: '', password: ''};

  constructor(
    private router: Router,
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { 
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

  sendRequest() {
    this.authService.sendResetPasswordRequest(this.user.email).then(result => {
      this.router.navigate(['/']);
    });
  }
}
