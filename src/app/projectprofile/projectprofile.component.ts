import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projectprofile',
  templateUrl: './projectprofile.component.html',
  styleUrls: ['./projectprofile.component.scss']
})
export class ProjectprofileComponent implements OnInit {

  profileId;
  constructor(
    private activedRoute: ActivatedRoute,
  ) {
    this.profileId = this.activedRoute.snapshot.params['id'];
    
  }

  ngOnInit() {
  }

}
