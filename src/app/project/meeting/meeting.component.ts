import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../../_services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  tablePath = '/meeting';

  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  displayedColumns = ['number', 'meeting', 'start', 'frequency', 'organizer'];
  dataSource = new MatTableDataSource(this.elements);

  frequencyOptions = [
    "One time",
    "As needed",
    "Daily",
    "Weelky",
    "Bi-Weekly",
    "Monthly",
    "Quarterly",
    "Yearly"
  ];

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
     
      var newRow: TableElement = {number: number, meeting: '', start:"", frequency: "", organizer: "", key: "newRow", position: position};
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
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface TableElement {
  number: number;
  meeting: string;
  start: string;
  frequency: string;
  organizer: string;
  key?: string;
  position?: number;
}