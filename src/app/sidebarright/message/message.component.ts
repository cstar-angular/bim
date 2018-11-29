import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { UserProfile } from '../../user/profile';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message;
  user;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    var me = this;
    this.authService.getUserById(this.message.userId).valueChanges().subscribe(data => {
     me.user = data;
    });
  }
}
