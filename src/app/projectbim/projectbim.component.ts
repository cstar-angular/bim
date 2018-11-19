import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-projectbim',
  templateUrl: './projectbim.component.html',
  styleUrls: ['./projectbim.component.scss']
})
export class ProjectbimComponent implements OnInit {

  displayedColumns = ['no', 'bim_use', 'check', 'software', 'version', 'format'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}

export interface PeriodicElement {
  no: string;
  bim_use: string;
  check: number;
  software: string;
  version: string;
  format: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: "U01", bim_use: 'Conceptual Design', check:1, software: "100", version: "200", format: "RVT, DWG, DWF, NWF"},
  {no: "U02", bim_use: 'Design Development', check:0, software: "200", version: "200", format: ""},
  {no: "U03", bim_use: 'Tsoftwareer', check:0, software: "100", version: "200", format: ""},
  {no: "U04", bim_use: 'Construction', check:1, software: "100", version: "200", format: ""},
  {no: "U05", bim_use: 'Handover', check:1, software: "100", version: "200", format: ""},
  {no: "U06", bim_use: 'Facility Management', check:0, software: "100", version: "200", format: ""},
  {no: "U07", bim_use: 'Conceptual Design', check:1, software: "100", version: "NA", format: ""},
  {no: "U08", bim_use: 'Design Development', check:1, software: "100", version: "200", format: ""},
  {no: "U09", bim_use: 'Tsoftwareer', check:0, software: "100", version: "200", format: ""},
  {no: "U10", bim_use: 'Construction', check:0, software: "NA", version: "200", format: ""},

];