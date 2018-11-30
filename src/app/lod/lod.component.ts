import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../_services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lod',
  templateUrl: './lod.component.html',
  styleUrls: ['./lod.component.scss']
})

export class LodComponent implements OnInit {

  tablePath = '/lods';

  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  stages = [];

  lods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  dropdowns = ['NA', '100', '200', '300', '400', '500'];

  displayedColumns = ['number', 'disciple', 'code'];
  dataSource;

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

    this.databaseService.getLists('/stages/' + this.projectId).valueChanges().subscribe(data => {
      this.stages = data;

      for (let stage of this.stages) {
        this.displayedColumns.push("s" + ("00" + stage.number).slice(-2));
      }
    });

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

      var newRow: TableElement = {number: number, disciple: "", code:"", code_color: "", stages: stageValues, key: "newRow", position: position, is_new: true};
      console.log(newRow);
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
        }
      }

      if(element.key == this.editableKey) {
        if(element.disciple && element.code) {
          this.databaseService.updateRow(this.tablePath, this.editableKey, element);
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
