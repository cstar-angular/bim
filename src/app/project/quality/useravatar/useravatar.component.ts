import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-useravatar',
  templateUrl: './useravatar.component.html',
  styleUrls: ['./useravatar.component.scss']
})
export class UseravatarComponent implements OnInit {

  @Input() userId;
  userProfile;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUserProfile().valueChanges().subscribe(data => {
      this.userProfile = data;
    });
  }

}
