import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WrapComponent } from './wrap/wrap.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectComponent } from './project/project.component';
import { LodComponent } from './lod/lod.component';
import { ProjectprofileComponent } from './projectprofile/projectprofile.component';
import { ProjectstageComponent } from './projectstage/projectstage.component';


const routes: Routes = [
  {
    component: WrapComponent,
    path: '',
    children:[
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'signin',
        component: SigninComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'project',
        component: ProjectComponent,
        children:[
          {
            path: 'profile',
            component: ProjectprofileComponent
          },
          {
            path: 'profile/:id',
            component: ProjectprofileComponent
          },
          {
            path: 'stage',
            component: ProjectstageComponent
          },
          {
            path: 'stage/:id',
            component: ProjectstageComponent
          },
          {
            path: 'lod/:id',
            component: LodComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
