import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../_services/database.service';
import { map } from 'rxjs/operators';
import { Statement } from '@angular/compiler';

@Component({
  selector: 'app-projectstage',
  templateUrl: './projectstage.component.html',
  styleUrls: ['./projectstage.component.scss']
})
export class ProjectstageComponent implements OnInit {

  tablePath = '/stages';

  isEditable = false;
  stages: StageElement[];
  selectedKey;
  editableKey;

  displayedColumns = ['number', 'stage', 'start', 'end', 'remarks'];
  dataSource = new MatTableDataSource(this.stages);

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    
    this.databaseService.getLists(this.tablePath).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(data => {
      this.stages = data;

      this.sortRecords();

      this.dataSource = new MatTableDataSource(this.stages);
    });
    
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  switchEditable() {
    this.isEditable = !this.isEditable;
  }

  selectRow(key) {
    if(this.isEditable) {
      this.selectedKey = key;
    }
  }

  insertRow() {
    if(!this.editableKey) {
      var number = 0;
      var position = 0;
      for (let stage of this.stages){
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
      this.stages.push(newRow);

      this.dataSource = new MatTableDataSource(this.stages);
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
    for (let stage of this.stages){
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
      for (let stage of this.stages){
        if(stage.key == this.selectedKey && this.stages[index - 1]) {
          var position = this.stages[index]['position'];
          this.stages[index]['position'] = this.stages[index - 1]['position'];
          this.databaseService.updateRow(this.tablePath, stage.key, this.stages[index]);

          this.stages[index - 1]['position'] = position;
          this.databaseService.updateRow(this.tablePath, this.stages[index - 1]['key'], this.stages[index - 1]);

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
      for (let stage of this.stages){
        if(stage.key == this.selectedKey && this.stages[index + 1]) {
          var position = this.stages[index]['position'];
          this.stages[index]['position'] = this.stages[index + 1]['position'];
          this.databaseService.updateRow(this.tablePath, stage.key, this.stages[index]);

          this.stages[index + 1]['position'] = position;
          this.databaseService.updateRow(this.tablePath, this.stages[index+1]['key'], this.stages[index+1]);

          break;
        }

        index++;
      }

      this.sortRecords();
    }
  }

  sortRecords() {
    this.stages.sort(function(a, b){return a.position - b.position});
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
