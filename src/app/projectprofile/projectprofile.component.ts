import { Component, OnInit, Inject, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectprofileService } from './projectprofile.service';
import { ProjectProfile } from './projectprofile';
import { DropdownService } from '../_services/dropdown.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


export interface DialogData {
  title: string;
}


@Component({
  selector: 'app-projectprofile',
  templateUrl: './projectprofile.component.html',
  styleUrls: ['./projectprofile.component.scss']
})
export class ProjectprofileComponent implements OnInit {

  projectKey = null;

  // Create new project profile object
  project = new ProjectProfile();

  // Define Dropdown menu options
  projectTypes: Observable<any[]>;
  contractTypes: Observable<any[]>;
  lengths: Observable<any[]>;
  areas: Observable<any[]>;
  volumns: Observable<any[]>;
  angles: Observable<any[]>;
  roundings: Observable<any[]>;
  templates: any[];

  // Define Country/timezones
  countries: any[];
  timezones: any[];

  isEditable = true;

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private projectprofileService: ProjectprofileService,
    private dropdownService: DropdownService,
    public dialog: MatDialog
  ) {
    this.projectKey = this.activedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    // Fetch dropdown options
    this.projectTypes = this.dropdownService.getProjectTypes().valueChanges();
    this.contractTypes = this.dropdownService.getContractTypes().valueChanges();
    this.lengths = this.dropdownService.getLengths().valueChanges();
    this.areas = this.dropdownService.getAreas().valueChanges();
    this.volumns = this.dropdownService.getVolumns().valueChanges();
    this.angles = this.dropdownService.getAngles().valueChanges();
    this.roundings = this.dropdownService.getRoundings().valueChanges();

    // Fetch project profile information
    if (this.projectKey !== null && this.projectKey !== undefined) {
    
      this.isEditable=false;

      this.projectprofileService.getProjectProfile(this.projectKey).valueChanges().subscribe(data => {
        this.project = data;
      });

      localStorage.setItem('pKey', this.projectKey);
    }
  }

  switEditable() {
    this.isEditable = !this.isEditable;
  }

  cancel() {
    if (this.projectKey !== null && this.projectKey !== undefined) {
      this.switEditable();
    } else {
      this.location.back();
    }
  }
  saveProject() {
    if (this.projectKey !== null && this.projectKey !== undefined) {
      this.projectprofileService.updateProject(this.projectKey, this.project);
      this.switEditable();
    } else {
      var result = this.projectprofileService.createProject(this.project);
      this.router.navigate(['/project/profile/' + result.ref.key]);
    }
    
  }

  deleteProject() {
    this.projectprofileService.deleteProject(this.projectKey);
  } 

  deleteAllProjects() {
    this.projectprofileService.deleteAll();
  }

  saveTemplateDialog(): void {
    const dialogRef = this.dialog.open(SaveTemplateDialog, {
      width: '250px',
      data: {title: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }

  archiveProjectDialog() {
    const dialogRef = this.dialog.open(SaveTemplateDialog, {
      width: '250px',
      data: {title: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }
}


@Component({
  selector: 'save-template-dialog',
  templateUrl: 'save-template-dialog.html',
})
export class SaveTemplateDialog {

  constructor(
    public dialogRef: MatDialogRef<SaveTemplateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}