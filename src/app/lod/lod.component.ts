import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../_services/database.service';
import { ApiService } from '../_services/api.service';
import { ProjectprofileService } from '../projectprofile/projectprofile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

@Component({
  selector: 'app-lod',
  templateUrl: './lod.component.html',
  styleUrls: ['./lod.component.scss']
})

export class LodComponent implements OnInit {

  projectKey = null;
  tablePath = '/lods';

  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  stages = [];

  stageFilter;
  lodFilter;

  dropdowns = ['NA', '100', '200', '300', '400', '500'];
  stageDropdown = [];

  displayedColumns = [];
  dataSource = new MatTableDataSource(this.elements);

  projectId;

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

    this.databaseService.getLists('/stages/' + this.projectId).valueChanges().subscribe(data => {
      this.stages = data;
      this.stageDropdown = data;

      if(this.stageFilter) {
        this.stages = this.stages.filter(ele => ele.key == this.stageFilter)
      }

      this.displayedColumns = ['number', 'disciple', 'code'];
      for (let stage of this.stages) {
        this.displayedColumns.push("s" + ("00" + stage.number).slice(-2));
      }
    });

    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      if (data) {
        this.elements = data;

        if(this.lodFilter) {
          this.elements = this.elements.filter(ele => JSON.stringify(ele.stages).includes(this.lodFilter));
        }
      }

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

      var stageValues = {};
      for (let stage of this.stages) {
        stageValues['s'+('00'+stage.number).slice(-2)] = 'NA';
      }

      var code_color = this.getRandomColorHex();
      var newRow: TableElement = {number: number, disciple: "", code:"", code_color: code_color, stages: stageValues, key: "newRow", position: position, is_new: true};

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
        if(element.disciple && element.code) {
          var result = this.databaseService.createRow(this.tablePath, element);

          element.key = result.key;
          element.is_new = false;
          this.databaseService.updateRow(this.tablePath, result.key, element);

          var notificationData = {
            "sender": this.currentUser.uid,
            "type": "add",
            "message": "The new LOD data was added.",
            "project": this.projectKey
          }
          this.apiService.sendRequest('sendNotification', notificationData).subscribe(result => {});
        }
      }

      if(element.key == this.editableKey) {
        if(element.disciple && element.code) {
          this.databaseService.updateRow(this.tablePath, this.editableKey, element);
          
          var notificationData = {
            "sender": this.currentUser.uid,
            "type": "update",
            "message": "The new LOD data was updated.",
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
    if(this.elements) {
      this.elements.sort(function(a, b){return a.position - b.position});
    }
  }

  getRandomColorHex() {
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
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
  disciple: string;
  code: string;
  code_color: string;
  stages: any;
  key?: string, 
  position?: number, 
  is_new?: boolean
}
