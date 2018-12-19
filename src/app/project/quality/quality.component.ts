import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../../_services/database.service';
import { ApiService } from '../../_services/api.service';
import { ProjectprofileService } from '../../projectprofile/projectprofile.service';
import { AuthService } from '../../_services/auth.service';
import { UserProfile } from '../../user/profile';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.scss']
})
export class QualityComponent implements OnInit {

  projectId = null;
  tablePath = '/quality';

  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  displayedColumns = ['number', 'discipline', 'checked_by', 'report_date', 'visual', 'interface', 'information', 'standards', 'remarks'];
  dataSource = new MatTableDataSource(this.elements);

  disciplines;
  assignedUsers: UserProfile[] = [];
  currentUser = new UserProfile();

  projectRole;
  projectProfile;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private apiService: ApiService,
    private projectprofileService: ProjectprofileService,
    private auth: AuthService,
    private router: Router
  ) {
    this.projectId = this.activedRoute.snapshot.params['id'];
    this.currentUser = this.auth.getAuthUser();
  }

  ngOnInit() {
    if(this.projectId) {
      this.databaseService.getRowDetails('projects' , this.projectId).valueChanges().subscribe(data => {
       if (data) {
         this.tablePath = this.tablePath + '/' + this.projectId;
        this.loadData();
       }else {
        this.router.navigate(['/']);
       }
      });
    } else {
      this.router.navigate(['/']);
    }

  }

  loadData() {
    this.auth.getUserProfile().valueChanges().subscribe(data => {
      this.currentUser = data;
    });

    this.databaseService.getLists('/lods/' + this.projectId).valueChanges().subscribe(data => {
      this.disciplines = data;
    });
    
    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      this.elements = data;

      this.sortRecords();

      this.dataSource = new MatTableDataSource(this.elements);
      this.dataSource.sort = this.sort;
      
      for (let element of this.elements) {
        this.assignedUsers.push(this.getUserData(element.checked_by));
      }

    });
    
    // Get the permission to edit the project
    if (this.projectId !== null) {

      this.projectprofileService.getProjectProfile(this.projectId).valueChanges().subscribe(data => {
        if (data) {
          if (data.created_by == this.currentUser.uid) {
            this.projectRole = 1;
          }
  
          this.projectProfile = data;
        }
      });
      
    }

    this.projectprofileService.getProjectRoleInfo(this.currentUser.uid, this.projectId).valueChanges().subscribe((info: any) => {
      if(info && info.length) {
        this.projectRole = info[0].access;
      }
    });

  }

  switchEditable() {
    this.isEditable = !this.isEditable;

    if (!this.isEditable) {
      this.editableKey = null;
      this.selectedKey = null;

      this.elements = this.elements.filter(ele => ele.key != "newRow");
      this.loadData();
      this.dataSource = new MatTableDataSource(this.elements);
    }
  }

  selectRow(key) {
    if(this.isEditable) {
      this.selectedKey = key;
    }
    
    if(this.editableKey != this.selectedKey) {
      this.editableKey = null;
    }
  }

  insertRow() {
    if(!this.editableKey) {
      var number = 0;
      var position = 0;
      for (let stage of this.elements){
        if(number < stage.number) {
          number = stage.number;
        }

        if(position < stage.position) {
          position = stage.position;
        }
      }

      number++;
      position++;
      console.log(this.currentUser);
      var newRow: TableElement = {number: number, discipline: '', checked_by: this.currentUser.uid, report_date:"", visual: false, interface: false, information: false, standards: false, remarks: "", key: "newRow", position: position};
      this.selectedKey = "newRow";
      this.editableKey = this.selectedKey;
      this.elements.push(newRow);

      this.dataSource = new MatTableDataSource(this.elements);
    }
  }

  deleteRow() {
    if(this.selectedKey) {
      this.databaseService.deleteRow(this.tablePath, this.selectedKey);
    }

    if(this.selectedKey == 'newRow') {
      
    }
  }

  editRow() {
    this.editableKey = this.selectedKey;
  }

  saveRow() {
    for (let stage of this.elements){
      if(stage.key == 'newRow') {
        var result = this.databaseService.createRow(this.tablePath, stage);
        stage.key = result.key;
        this.databaseService.updateRow(this.tablePath, result.key, stage);
        
        var notificationData = {
          "sender": this.currentUser.uid,
          "type": "add",
          "message": this.projectProfile.number + " - BIM Quality",
          "project": this.projectId
        }
        this.apiService.sendRequest('sendNotification', notificationData).subscribe(result => {});
      }

      if(stage.key == this.editableKey) {
        this.databaseService.updateRow(this.tablePath, this.editableKey, stage);
        
        var notificationData = {
          "sender": this.currentUser.uid,
          "type": "update",
          "message": this.projectProfile.number + " - BIM Quality",
          "project": this.projectId
        }
        this.apiService.sendRequest('sendNotification', notificationData).subscribe(result => {});
      }
    }

    this.editableKey = null;
  }

  sortRecords() {
    this.elements.sort(function(a, b){return a.position - b.position});
  }

  switchVisual() {
    for (let element of this.elements){
      if(element.key == this.editableKey) {
        element.visual = !element.visual;
      }
    }
  }

  switchInterface() {
    for (let element of this.elements){
      if(element.key == this.editableKey) {
        element.interface = !element.interface;
      }
    }
  }
  
  switchInformation() {
    for (let element of this.elements){
      if(element.key == this.editableKey) {
        element.information = !element.information;
      }
    }
  }
  
  switchStandards() {
    for (let element of this.elements){
      if(element.key == this.editableKey) {
        element.standards = !element.standards;
      }
    }
  }
  
  getUserData(uid) {
    return this.databaseService.getRowDetails('/users/', uid).snapshotChanges().subscribe(data => {
      return data;
    });
  }

  getDiscipline(key) {
    var discipline;
    this.disciplines.map(item => {
      if(item.key == key) {
        discipline = item.disciple;
      }
    });
    return discipline;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface TableElement {
  number: number;
  discipline: any;
  checked_by: string;
  block_name?: string;
  block_number?: string;
  report_date: string;
  visual: boolean;
  interface: boolean;
  information: boolean;
  standards: boolean;
  remarks: string;
  key?: string;
  position?: number;
}