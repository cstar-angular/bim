import { Component, OnInit, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectprofileService } from './projectprofile.service';
import { ProjectProfile } from './projectprofile';
import { DropdownService } from '../_services/dropdown.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projectprofile',
  templateUrl: './projectprofile.component.html',
  styleUrls: ['./projectprofile.component.scss']
})
export class ProjectprofileComponent implements OnInit {

  project = new ProjectProfile();

  profileId;
  projectTypes: Observable<any[]>;
  contractTypes: Observable<any[]>;
  lengths: Observable<any[]>;
  areas: Observable<any[]>;
  volumns: Observable<any[]>;
  angles: Observable<any[]>;
  roundings: Observable<any[]>;

  countries: any[];
  timezones: any[];

  templates: any[];

  constructor(
    private activedRoute: ActivatedRoute,
    private projectprofileService: ProjectprofileService,
    private dropdownService: DropdownService
  ) {
    this.profileId = this.activedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.projectTypes = this.dropdownService.getProjectTypes().valueChanges();
    this.contractTypes = this.dropdownService.getContractTypes().valueChanges();
    this.lengths = this.dropdownService.getLengths().valueChanges();
    this.areas = this.dropdownService.getAreas().valueChanges();
    this.volumns = this.dropdownService.getVolumns().valueChanges();
    this.angles = this.dropdownService.getAngles().valueChanges();
    this.roundings = this.dropdownService.getRoundings().valueChanges();
  }

  addProject() {console.log(this.project);
    this.projectprofileService.createProject(this.project);
  }

  updateProject() {
    this.projectprofileService.updateProject(this.profileId, this.project);
  }

  deleteProject() {
    this.projectprofileService.deleteProject(this.profileId);
  }

  deleteAllProjects() {
    this.projectprofileService.deleteAll();
  }
}
