import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../_services/auth.service';
import { DatabaseService } from '../../../_services/database.service';
import { ProjectProfile } from '../../../projectprofile/projectprofile';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  projectKey;
  teamId;

  currentUser;

  project = new ProjectProfile();
  team;

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) { 
    this.projectKey = this.activedRoute.snapshot.params['pid'];
    this.teamId = this.activedRoute.snapshot.params['teamid'];
  }

  ngOnInit() {
    this.currentUser = this.authService.getAuthUser();
    this.databaseService.getRowDetails('/projects', this.projectKey).valueChanges().subscribe(data => {
      this.project = data;
    })
    this.databaseService.getRowDetails('/teams/' + this.projectKey, this.teamId).valueChanges().subscribe(data => {
      this.team = data;
    });
  }

  accept() {
    this.team.uid = this.currentUser.uid; console.log(this.team);
    this.databaseService.updateRow('/teams/' + this.projectKey, this.teamId, this.team);

    this.router.navigate(['/project/team/' + this.projectKey]);
  }

  decline() {

  }
}
