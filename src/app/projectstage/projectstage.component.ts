import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../_services/database.service';
import { ApiService } from '../_services/api.service';
import { ProjectprofileService } from '../projectprofile/projectprofile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-projectstage',
  templateUrl: './projectstage.component.html',
  styleUrls: ['./projectstage.component.scss']
})
export class ProjectstageComponent implements OnInit {

  projectKey = null;
  tablePath = '/stages';

  isEditable = false;
  elements: StageElement[];
  selectedKey;
  editableKey;

  displayedColumns = ['number', 'stage', 'start', 'end', 'remarks'];
  dataSource = new MatTableDataSource(this.elements);

  @ViewChild(MatSort) sort: MatSort;

  projectId;

  currentUser;
  projectRole;

  constructor(
    private activedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private apiService: ApiService,
    private projectprofileService: ProjectprofileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.projectKey = this.activedRoute.snapshot.params['id'];
    this.currentUser = this.authService.getAuthUser();
  }

  ngOnInit() {

    var url = this.router.url;
    var urlItems = url.split('/');

    if(urlItems.length >= 4) {
      this.projectId = urlItems[3];

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
    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      this.elements = data;

      this.sortRecords();

      this.dataSource = new MatTableDataSource(this.elements);
    });
    
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
    
    // Get the permission to edit the project
    if (this.projectKey !== null) {

      this.projectprofileService.getProjectProfile(this.projectKey).valueChanges().subscribe(data => {
        if (data.created_by == this.currentUser.uid) {
          this.projectRole = 1;
        }
      });
      
    }

    this.projectprofileService.getProjectRoleInfo(this.currentUser.uid, this.projectKey).valueChanges().subscribe((info: any) => {
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

      var newRow: StageElement = {number: number, stage: '', start:"", end: "", remarks: "", key: "newRow", position: position};
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
    for (let element of this.elements){
      if(element.key == 'newRow') {
        var result = this.databaseService.createRow(this.tablePath, element);
        element.key = result.key;
        this.databaseService.updateRow(this.tablePath, result.key, element);
        
        var notificationData = {
          "sender": this.currentUser.uid,
          "type": "add",
          "message": "The new Project Stage was added.",
          "project": this.projectKey
        }
        this.apiService.sendRequest('sendNotification', notificationData);
      }

      if(element.key == this.editableKey) {
        this.databaseService.updateRow(this.tablePath, this.editableKey, element);
        
        var notificationData = {
          "sender": this.currentUser.uid,
          "type": "update",
          "message": "The Project Stage data was updated.",
          "project": this.projectKey
        }
        this.apiService.sendRequest('sendNotification', notificationData);
      }
    }

    this.editableKey = null;
  }

  moveUp() {
    if(!this.editableKey) {
      var index = 0;
      for (let element of this.elements){
        if(element.key == this.selectedKey && this.elements[index - 1]) {
          var position = this.elements[index]['position'];
          this.elements[index]['position'] = this.elements[index - 1]['position'];
          this.databaseService.updateRow(this.tablePath, element.key, this.elements[index]);

          this.elements[index - 1]['position'] = position;
          this.databaseService.updateRow(this.tablePath, this.elements[index - 1]['key'], this.elements[index - 1]);

          break;
        }

        index++;
      }

      this.sortRecords();
    }
  }

  moveDown() {
    if(!this.editableKey) {
      var index = 0;
      for (let element of this.elements){
        if(element.key == this.selectedKey && this.elements[index + 1]) {
          var position = this.elements[index]['position'];
          this.elements[index]['position'] = this.elements[index + 1]['position'];
          this.databaseService.updateRow(this.tablePath, element.key, this.elements[index]);

          this.elements[index + 1]['position'] = position;
          this.databaseService.updateRow(this.tablePath, this.elements[index+1]['key'], this.elements[index+1]);

          break;
        }

        index++;
      }

      this.sortRecords();
    }
  }

  sortRecords() {
    if(this.elements) {
      this.elements.sort(function(a, b){return a.position - b.position});
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}

export interface StageElement {
  number: number;
  stage: string;
  start: string;
  end: string;
  remarks: string;
  key?: string;
  position?: number;
}
