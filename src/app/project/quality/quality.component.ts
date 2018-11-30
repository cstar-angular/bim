import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../../_services/database.service';
import { AuthService } from '../../_services/auth.service';
import { map } from 'rxjs/operators';
import { UserProfile } from '../../user/profile';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.scss']
})
export class QualityComponent implements OnInit {

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

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private databaseService: DatabaseService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.getUserProfile().valueChanges().subscribe(data => {
      this.currentUser = data;
    });

    this.databaseService.getLists('/lods').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(data => {
      this.disciplines = data;
    });
    
    this.databaseService.getLists(this.tablePath).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(data => {
      this.elements = data;

      for (let element of this.elements) {
          this.assignedUsers.push(this.getUserData(element.checked_by));
      }

      this.sortRecords();

      this.dataSource = new MatTableDataSource(this.elements);
    });
    
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  switchEditable() {
    this.isEditable = !this.isEditable;

    if (!this.isEditable) {
      this.editableKey = null;
      this.selectedKey = null;
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
      }

      if(stage.key == this.editableKey) {
        this.databaseService.updateRow(this.tablePath, this.editableKey, stage);
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