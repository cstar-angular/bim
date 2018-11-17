import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WrapComponent } from './wrap/wrap.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectComponent } from './project/project.component';
import { LodComponent } from './lod/lod.component';


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
            path: 'LOD',
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
