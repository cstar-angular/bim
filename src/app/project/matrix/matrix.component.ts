import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../_services/database.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

  configurations;
  selectedConfiguration;
  lods;
  projectId;
  tablePath = '/matrix';
  displayedColumns = ['no', 'code'];
  dataSource;
  tempMatrix;
  isEditable = false;
  
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private router: Router,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    var url = this.router.url;
    var urlItems = url.split('/');

    if(urlItems.length >= 4) {
      this.projectId = urlItems[3];

      this.databaseService.getRowDetails('projects' , this.projectId).valueChanges().subscribe(data => {
       if (data) {
        this.tablePath = this.tablePath + '/' + this.projectId;
        this.loadConfigurations();
        // this.loadData();

       }else {
        this.router.navigate(['/']);
       }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  loadConfigurations() {
    this.databaseService.getLists('/project_configuration/' + this.projectId ).valueChanges().subscribe(data => {
      this.configurations = data;
      if(data.length > 0) {
        this.selectedConfiguration = data[0].key;
        this.loadLods();
      }       
    })
  }

  loadLods() {
    this.databaseService.getLists('/lods/' + this.projectId ).valueChanges().subscribe(data => {
      this.lods = data;
      if(data.length > 0) {
        this.displayedColumns = ['no', 'code'];
        for (let lod of this.lods) {
          this.displayedColumns.push(lod.key);
        }
        this.loadMatrix();
      }
    })
  }

  loadMatrix() {
    this.databaseService.getLists(this.tablePath + '/' + this.selectedConfiguration).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(data => {
      this.tempMatrix = data;
      this.makeMatrix();
    });
  }

  makeMatrix() {
    var elements = [];
    this.lods.forEach(row => { // row
      var rowData = this.getRow(row.key);
      var tempRow = {};
      this.lods.forEach(column => { // column 
        var cell = this.getCell(rowData, column.key);
        tempRow[column.key] = cell;
       
      });
      
      var element = {};
      element['no'] = 'D' + row.number;
      element['code'] = {
        code: row.code,
        code_color: row.code_color
      };
      element['key'] = row.key;
      element['matrix'] = tempRow;
      elements.push(element)
    });
   this.dataSource = new MatTableDataSource(elements);
  }

  getCell(row, columnNo){
   var cell;
    if (row[columnNo]) {
      cell = row[columnNo];
    } else {
      cell = {
        priority: 'NA',
        status: 'NA'
      }
    }
    return cell;
  }

  getRow(rowNo) {
   var returnRow;
   this.tempMatrix.forEach(row => {
      if(row.key == rowNo) {
        returnRow = row;
      }
    });
    if (!returnRow) return [];
    return returnRow;
  }

  switchEditable() {
    this.isEditable = !this.isEditable;
  }

  changedConf(){
    this.loadMatrix();
  }

}


export interface TableElement {
  no: string
  code: string;
  matrix: any;
}
