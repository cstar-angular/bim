import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from '../user/profile';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() userProfile;
  avartarImage = {
    type: '',
    val: ''
  }
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.avartarImage = this.authService.getAvartarImage(this.userProfile);
  }

}
