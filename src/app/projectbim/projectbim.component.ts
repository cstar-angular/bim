import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../_services/database.service';
import { ApiService } from '../_services/api.service';
import { ProjectprofileService } from '../projectprofile/projectprofile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-projectbim',
  templateUrl: './projectbim.component.html',
  styleUrls: ['./projectbim.component.scss']
})
export class ProjectbimComponent implements OnInit {

  projectKey = null;
  tablePath = '/bims';

  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  softwareFilter;
  checkedFilter;
  versionFilter;

  displayedColumns = ['number', 'bim_use', 'check', 'software', 'version', 'format'];
  dataSource = new MatTableDataSource(this.elements);

  projectId;
  stages;

  softwares = [
    "Revit",
    "Bentley BIM Suite",
    "SketchUp",
    "ArchiCAD",
    "Vectorworks",
    "Tekla Structures",
    "Vico Office",
    "Quantm",
    "Digital Project",
    "Cadpipe HVAC",
    "Fabrication CADMEP",
    "AutoCAD",
    "AutoCAD Civil 3D",
    "Robot",
    "STAAD Pro",
    "FloVent",
    "Fluent",
    "Sefaira",
    "Navisworks",
    "BIM360 Field",
    "BIM360 Glue",
    "BIM360 Layout",
    "BIM360 Plan",
    "BIM360 Docs",
    "ProectDox",
    "Project Wise",
    "Solibri Model Checker"
  ];

  currentUser;
  projectRole;

  @ViewChild(MatSort) sort: MatSort;

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
      this. projectId = urlItems[3];

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
    // Get the stages dropdown list
    this.databaseService.getLists('/stages/' + this.projectId).valueChanges().subscribe(data => {
      this.stages = data;
    });

    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      this.elements = data;

      if(this.checkedFilter) {
        this.elements = this.elements.filter(ele => ele.check == this.checkedFilter)
      }

      if(this.softwareFilter) {
        this.elements = this.elements.filter(ele => ele.software == this.softwareFilter)
      }

      if(this.versionFilter) {
        this.elements = this.elements.filter(ele => ele.version == this.versionFilter)
      }

      this.sortRecords();

      this.dataSource = new MatTableDataSource(this.elements);
      this.dataSource.sort = this.sort;
    });
    
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
      this.loadData();
      this.dataSource = new MatTableDataSource(this.elements);
    }
  }

  switchToggle() {
    for (let element of this.elements) {
      if (element.key == this.editableKey) {
        element.check = !element.check;
      }
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
      for (let element of this.elements){
        if(number < element.number) {
          number = element.number;
        }

        if(position < element.position) {
          position = element.position;
        }
      }

      number++;
      position++;

      var newRow: TableElement = {number: number, bim_use: '', check:true, software: "", version: "", format: "", key: "newRow", position: position, is_new: true};
      this.selectedKey = "newRow";
      this.editableKey = this.selectedKey;
      this.elements.push(newRow);

      this.dataSource = new MatTableDataSource(this.elements);
    }
  }

  deleteRow() {console.log(this.selectedKey);
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
        if(element.bim_use) {
          element.is_new = false;
          var result = this.databaseService.createRow(this.tablePath, element);
          element.key = result.key;
          this.databaseService.updateRow(this.tablePath, result.key, element);
          
          var notificationData = {
            "sender": this.currentUser.uid,
            "type": "add",
            "message": "The new Project Bim data was added.",
            "project": this.projectKey
          }
          this.apiService.sendRequest('sendNotification', notificationData).subscribe(result => {});
        }
      }

      if(element.key == this.editableKey) {
        if(element.bim_use) {
          element.is_new = false;
          this.databaseService.updateRow(this.tablePath, this.editableKey, element);
          
          var notificationData = {
            "sender": this.currentUser.uid,
            "type": "update",
            "message": "The new Project Bim data was updated.",
            "project": this.projectKey
          }
          this.apiService.sendRequest('sendNotification', notificationData).subscribe(result => {});
        }
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
    this.elements.sort(function(a, b){return a.position - b.position});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterBySelection() {
    this.loadData();
  }
}

export interface TableElement {
  number: number;
  bim_use: string;
  check: boolean;
  software?: string;
  version?: string;
  format?: string;
  key?: string;
  position?: number;
  is_new?: boolean
}
