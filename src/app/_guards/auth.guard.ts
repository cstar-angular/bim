import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth, private authSerive: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (firebase.auth().currentUser) {
        return true;
      }

      // not logged in so redirect to login page with the return url
      // this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});

      if(this.authSerive.currentUserObservable){
        return true;
      }

      this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}