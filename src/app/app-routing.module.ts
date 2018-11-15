import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WrapComponent } from './wrap/wrap.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    component: WrapComponent,
    path: '',
    children:[
      {
        path: '',
        component: SigninComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
