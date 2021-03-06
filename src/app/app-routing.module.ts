import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { WrapComponent } from './wrap/wrap.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectComponent } from './project/project.component';
import { LodComponent } from './lod/lod.component';
import { ProjectprofileComponent } from './projectprofile/projectprofile.component';
import { ProjectstageComponent } from './projectstage/projectstage.component';
import { ProjectbimComponent } from './projectbim/projectbim.component';
import { AuthGuard } from './_guards/auth.guard';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ProjectconfComponent } from './projectconf/projectconf.component';
import { TeamComponent } from './project/team/team.component';
import { MeetingComponent } from './project/meeting/meeting.component';
import { ExpiredComponent } from './expired/expired.component'
import { UpgradeComponent } from './upgrade/upgrade.component';
import { MatrixComponent } from './project/matrix/matrix.component';
import { QualityComponent } from './project/quality/quality.component';
import { InviteComponent } from './project/team/invite/invite.component';


const routes: Routes = [
  
  {
    component: WrapComponent,
    path: '',
    children:[
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'signin',
        component: SigninComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },  
      {
        path: 'signup/:pid/:teamid',
        component: SignupComponent
      },      
      {
        path: 'forgetpassword',
        component: ForgetpasswordComponent
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'project',
        component: ProjectComponent,
        canActivate: [AuthGuard],
        children:[
          {
            path: 'new',
            component: ProjectprofileComponent
          },
          {
            path: 'profile/:id',
            component: ProjectprofileComponent
          },
          {
            path: 'stage/:id',
            component: ProjectstageComponent
          },
          {
            path: 'bim/:id',
            component: ProjectbimComponent
          },
          {
            path: 'lod/:id',
            component: LodComponent
          },
          {
            path: 'conf/:id',
            component: ProjectconfComponent
          },
          {
            path: 'team/:id',
            component: TeamComponent
          },
          {
            path: 'meeting/:id',
            component: MeetingComponent
          },
          {
            path: 'matrix/:id',
            component: MatrixComponent
          },
          {
            path: 'quality/:id',
            component: QualityComponent
          }
        ]
      },
      {
        path: 'expired',
        component: ExpiredComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'upgrade',
        component: UpgradeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invite/:pid/:teamid',
        component: InviteComponent
      },
      
    ], 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
