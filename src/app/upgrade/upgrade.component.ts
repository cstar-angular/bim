import { Component, OnInit, HostListener } from '@angular/core';
import { Options } from 'ng5-slider';
import { UpgradeService } from '../_services/upgrade.service';
import { AuthService } from '../_services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
declare var StripeCheckout: any;
@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  value: number = 5;
  options: Options = {
    floor: 5,
    ceil: 30,
    step: 5,
    showTicks: true,
    showTicksValues: true
  };

  authUser;
  user;
  isLoading = true;


  handler: any;
  amount: number = 500;
  

  constructor(
    private upgradeService: UpgradeService,
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
      if (data && data.membership) {
        this.value = data.membership.type;
      }

    });

    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: '/assets/images/logo-stripe.png',
      locale: 'auto',
      token: token => {
        this.upgradeService.processPayment(token, this.amount * 50 * 100, this.value);
        location.href = '/';
      }
    })
  }

  handlePayment() {
    this.handler.open({
      name: "BIM Membership",
      description: "Upgrade Membership",
      amount: this.value * 50 * 100
    })
  }

  @HostListener('window:popstate')
    onpopstate() {
      this.handler.close()
    }

}
