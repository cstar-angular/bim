import { Component, OnInit, Inject, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectprofileService } from './projectprofile.service';
import { ProjectProfile } from './projectprofile';
import { DropdownService } from '../_services/dropdown.service';
import { DatabaseService } from '../_services/database.service';
import { Observable, from } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Evented, Event } from '../_services/evented';
import { AuthService } from '../_services/auth.service';

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
  message;
  teamid;
  
  currentUser;
  projectRole;

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private databaseService: DatabaseService,
    private projectprofileService: ProjectprofileService,
    private dropdownService: DropdownService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.projectKey = this.activedRoute.snapshot.params['id'];
    this.teamid = this.activedRoute.snapshot.params['teamid'];
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

    this.currentUser = this.authService.getAuthUser();

    // Fetch project profile information
    if (this.projectKey !== null && this.projectKey !== undefined) {
    
      this.isEditable=false;

      this.projectprofileService.getProjectProfile(this.projectKey).valueChanges().subscribe(data => {
        this.project = data;
        if (this.project.created_by == this.currentUser.uid) {
          this.projectRole = 1;
        }
      });
    } else {
      this.project = new ProjectProfile();
      this.project.created_by = this.authService.getAuthUser().uid;
    }

    if (this.teamid) {
      this.databaseService.updateRow('/teams/' + this.projectKey, this.teamid, {uid: this.currentUser.uid});
    }

    this.projectprofileService.getProjectRoleInfo(this.currentUser.uid, this.projectKey).valueChanges().subscribe((info: any) => {
      if(info) {
        this.projectRole = info[0].access;
      }
    });

    Evented.on('updateProjectImage', (e: Event<{imgUrl: any}>) => {
      this.project.thumb_image = e.args.imgUrl;
      this.saveProject();
    });
  }

  switchEditable() {
    this.isEditable = !this.isEditable;
    
    Evented.fire('editmod', {
      mode: this.isEditable
    });
  }

  cancel() {
    if (this.projectKey !== null && this.projectKey !== undefined) {
      this.switchEditable();
    } else {
      this.location.back();
    }
  }
  saveProject() {
    if (this.projectKey !== null && this.projectKey !== undefined) {
      this.projectprofileService.updateProject(this.projectKey, this.project);
      this.switchEditable();
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
      width: '500px',
      data: {title: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        var template = this.project;
        template.template_title = result;
        this.databaseService.createRow('/templates', template).then(result => {
          if(result.key) {
            // this.message = "Template was saved successfully!";
          }
        });
      }
    });
  }

  archiveProjectDialog() {
    const dialogRef = this.dialog.open(ArchiveDialog, {
      width: '500px',
      data: {key: this.projectKey, project: this.project}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.project.is_archive = true;
        this.projectprofileService.updateProject(this.projectKey, this.project).then( res => console.log(res));
      }
    });
  }
}

// Define Dialog components

export interface DialogData {
  title: string;
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

@Component({
  selector: 'archive-dialog',
  templateUrl: 'archive.html',
})
export class ArchiveDialog {

  constructor(
    public dialogRef: MatDialogRef<ArchiveDialog>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}