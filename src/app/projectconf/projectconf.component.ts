import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../_services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectconf',
  templateUrl: './projectconf.component.html',
  styleUrls: ['./projectconf.component.scss']
})
export class ProjectconfComponent implements OnInit {

  tablePath = '/project_configuration';

  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  displayedColumns = ['number', 'block', 'area', 'levels', 'remarks'];
  dataSource = new MatTableDataSource(this.elements);

  projectId;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) { }

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
    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      this.elements = data;

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
     
      var newRow: TableElement = {number: number, block: '', area:"", levels: "", remarks: "", key: "newRow", position: position};
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
  
}

export interface TableElement {
  number: number;
  block: string;
  area: string;
  levels: string;
  remarks: string;
  key?: string;
  position?: number;
}