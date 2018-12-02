import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // return this.authService.isSignedInStream;
   
    
    return this.authService.isSignedInStream.pipe(
      map<boolean, boolean>((isSignedIn: boolean) => {

        if (!isSignedIn) {
          this.router.navigate(['/signin']);
        }
        
        var url = this.router.url;
        var authUser = this.afAuth.auth.currentUser;
        
        if(url == '/upgrade') 
        {
          this.router.navigate(['/upgrade']);
        } else {
          this.authService.getUserByIdPromise(authUser.uid).then(data => {
            var now = new Date().getTime();
            if(!data.membership) {
              var created: any = authUser.metadata;
              created = created['a'];   
              var diff = now - created;
              var diff = diff / 1000 / 3600 / 24;
              if (diff >= 30) {
                this.router.navigate(['/expired']);
              }
            } else {
              if (data.membership.type != 30) {
                var upgrade = data.membership.created;
                var diff = now - upgrade;
                var diff = diff / 1000 / 3600 / 24;
                if (diff >= 30) {
                  this.router.navigate(['/expired']);
                }
              }
            }
          });
        } 
        return isSignedIn;
      })
    )
  }
}