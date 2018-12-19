import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../../_services/database.service';
import { ApiService } from '../../_services/api.service';
import { ProjectprofileService } from '../../projectprofile/projectprofile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  projectId = null;
  tablePath = '/teams';
  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  disciplineFilter;
  roleFilter;
  accessFilter;

  displayedColumns = ['name', 'company', 'discipline', 'role', 'access', 'email', 'phone'];
  dataSource = new MatTableDataSource(this.elements);

  disciplines;
  firstDis;
  roles = [
    {key: 0, val: 'Owner'},
    {key: 1, val: 'Architect'},
    {key: 2, val: 'Engineer'},
    {key: 3, val: 'BIM Manager'},
    {key: 4, val: 'BIM Coordinartor'},
    {key: 5, val: 'BIM Modeller'},
    {key: 6, val: 'Cost Estimator'},
    {key: 7, val: 'MEP Engineer'},
    {key: 0, val: 'Structural Engineer'},
    {key: 0, val: 'Landscape Designer'},
    {key: 0, val: 'Project Manager'}
  ];

  accesses = [
    {key: 0, val: 'Viewer'},
    {key: 1, val: 'Editor'}
  ];

  currentUser;
  projectRole;
  projectProfile;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private projectprofileService: ProjectprofileService,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.projectId = this.activedRoute.snapshot.params['id'];
    this.currentUser = this.authService.getAuthUser();
  }

  ngOnInit() {

    if(this. projectId) {
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
    this.databaseService.getLists('/lods/' + this.projectId).valueChanges().subscribe(data => {
      this.disciplines = data;
      
      if(this.disciplineFilter) {
        this.disciplines = this.disciplines.filter(ele => ele.key == this.disciplineFilter)
      }

      data.forEach(item => {
        // this.disciplines[item.key] = item;
        if(!this.firstDis) {
          this.firstDis = item.key;
        }
      })
    
    });

    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      this.elements = data;
      
      if(this.roleFilter != null && this.roleFilter != '') {
        this.elements = this.elements.filter(ele => ele.role == this.roleFilter)
      }

      if(this.accessFilter != null && this.accessFilter != undefined) {
        this.elements = this.elements.filter(ele => ele.access == this.accessFilter)
      }
      this.dataSource = new MatTableDataSource(this.elements);
      this.dataSource.sort = this.sort;
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

      var newRow: TableElement = {name: '', company: '', discipline: this.firstDis, role: 0, access: 1, email: "", phone: "", randomColor: this.authService.getRandomColorHex(),key: 'newRow',  is_new: true};
      this.selectedKey = "newRow";
      this.editableKey = this.selectedKey;
      this.elements.push(newRow);

      this.dataSource = new MatTableDataSource(this.elements);
    }
  }

  getDisciplineByKey(key) {
    var discipline;
    this.disciplines.forEach(item => {
      if(item.key ===  key) {
        discipline = item;
      }
    })
    return discipline;
  }

  saveRow() {
    for (let element of this.elements){
      if(element.key == 'newRow') {
        if(element.name && element.company && element.email) {
          element.is_new = false;
          var result = this.databaseService.createRow(this.tablePath, element);
          element.key = result.key;
          this.databaseService.updateRow(this.tablePath, result.key, element);

          // send invite email
          var param = {
            "teamid": element.key,
            "project": this.projectId
          };
          this.apiService.sendRequest("sendInvitation",param).subscribe(result => {});
          // create fake account or insert key into team member
        }
      }

      if(element.key == this.editableKey) {
        if(element.name && element.company && element.email) {
          element.is_new = false;
          this.databaseService.updateRow(this.tablePath, this.editableKey, element);

          // send update email
        }
      }
    }

    this.editableKey = null;
  }

  editRow() {
    this.editableKey = this.selectedKey;
  }

  deleteRow() {
    if(this.selectedKey) {
      this.databaseService.deleteRow(this.tablePath, this.selectedKey);
    }

    if(this.selectedKey == 'newRow') {
      
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterBySelection() {
    this.loadData();
  }
}


export interface TableElement {
  name: string;
  company: string;
  discipline: string;
  role: number;
  access: number;
  email: string;
  phone?: string;
  randomColor: string;
  is_new: boolean;
  key?: string;
}
