import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-projectstage',
  templateUrl: './projectstage.component.html',
  styleUrls: ['./projectstage.component.scss']
})
export class ProjectstageComponent implements OnInit {

  displayedColumns = ['position', 'stage', 'start', 'end', 'remarks'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}

export interface PeriodicElement {
  position: string;
  stage: string;
  start: string;
  end: string;
  remarks: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "S01", stage: 'Conceptual Design', start:"ARCH", end: "100", remarks: "200"},
  {position: "S02", stage: 'Design Development', start:"STR", end: "200", remarks: "200"},
  {position: "S03", stage: 'Tender', start:"CVL", end: "100", remarks: "200"},
  {position: "S04", stage: 'Construction', start:"MECH", end: "100", remarks: "200"},
  {position: "S05", stage: 'Handover', start:"ELE", end: "100", remarks: "200"},
  {position: "S06", stage: 'Facility Management', start:"PLU", end: "100", remarks: "200"},
  {position: "S07", stage: 'Conceptual Design', start:"FIRE", end: "100", remarks: "NA"},
  {position: "S08", stage: 'Design Development', start:"LS", end: "100", remarks: "200"},
  {position: "S09", stage: 'Tender', start:"FIX", end: "100", remarks: "200"},
  {position: "S10", stage: 'Construction', start:"FURN", end: "NA", remarks: "200"},

  {position: "S11", stage: 'Handover', start:"ARCH", end: "100", remarks: "200"},
  {position: "S12", stage: 'Facility Management', start:"STR", end: "200", remarks: "200"},
  {position: "S13", stage: 'Conceptual Design', start:"CVL", end: "100", remarks: "200"},
  {position: "S14", stage: 'Design Development', start:"MECH", end: "100", remarks: "200"},
  {position: "S15", stage: 'Tender', start:"ELE", end: "100", remarks: "200"},
  {position: "S16", stage: 'Carbon', start:"PLU", end: "100", remarks: "200"},
  {position: "S17", stage: 'Nitrogen', start:"FIRE", end: "100", remarks: "NA"},
  {position: "S18", stage: 'Oxygen', start:"LS", end: "100", remarks: "200"},
  {position: "S19", stage: 'Fluorine', start:"FIX", end: "100", remarks: "200"},
  {position: "S20", stage: 'Neon', start:"FURN", end: "NA", remarks: "200"},

  {position: "S21", stage: 'Hydrogen', start:"ARCH", end: "100", remarks: "200"},
  {position: "S22", stage: 'Helium', start:"STR", end: "200", remarks: "200"},
  {position: "S23", stage: 'Lithium', start:"CVL", end: "100", remarks: "200"},
  {position: "S24", stage: 'Beryllium', start:"MECH", end: "100", remarks: "200"},
];