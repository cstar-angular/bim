import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-lod',
  templateUrl: './lod.component.html',
  styleUrls: ['./lod.component.scss']
})

export class LodComponent implements OnInit {

  stages = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  lods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  displayedColumns = ['position', 'disciple', 'code', 's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's08', 's09'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}

export interface Element {
  position: number,
  name: string,
  weight: number,
  symbol: string
}

export interface PeriodicElement {
  position: number;
  disciple: string;
  code: string;
  s01: string;
  s02: string;
  s03: string;
  s04: string;
  s05: string;
  s06: string;
  s07: string;
  s08: string;
  s09: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, disciple: 'Hydrogen', code:"ARCH", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 2, disciple: 'Helium', code:"STR", s01: "200", s02: "200", s03: "200", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 3, disciple: 'Lithium', code:"CVL", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 4, disciple: 'Beryllium', code:"MECH", s01: "100", s02: "200", s03: "NA", s04: "300", s05: "400", s06: "400", s07: "400", s08: "500", s09: "200"},
  {position: 5, disciple: 'Boron', code:"ELE", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 6, disciple: 'Carbon', code:"PLU", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "400", s07: "400", s08: "500", s09: "200"},
  {position: 7, disciple: 'Nitrogen', code:"FIRE", s01: "100", s02: "NA", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 8, disciple: 'Oxygen', code:"LS", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "NA", s08: "500", s09: "200"},
  {position: 9, disciple: 'Fluorine', code:"FIX", s01: "100", s02: "200", s03: "NA", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 10, disciple: 'Neon', code:"FURN", s01: "NA", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},

  {position: 11, disciple: 'Hydrogen', code:"ARCH", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 12, disciple: 'Helium', code:"STR", s01: "200", s02: "200", s03: "200", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 13, disciple: 'Lithium', code:"CVL", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 14, disciple: 'Beryllium', code:"MECH", s01: "100", s02: "200", s03: "NA", s04: "300", s05: "400", s06: "400", s07: "400", s08: "500", s09: "200"},
  {position: 15, disciple: 'Boron', code:"ELE", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 16, disciple: 'Carbon', code:"PLU", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "400", s07: "400", s08: "500", s09: "200"},
  {position: 17, disciple: 'Nitrogen', code:"FIRE", s01: "100", s02: "NA", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 18, disciple: 'Oxygen', code:"LS", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "NA", s08: "500", s09: "200"},
  {position: 19, disciple: 'Fluorine', code:"FIX", s01: "100", s02: "200", s03: "NA", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 20, disciple: 'Neon', code:"FURN", s01: "NA", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},

  {position: 21, disciple: 'Hydrogen', code:"ARCH", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 22, disciple: 'Helium', code:"STR", s01: "200", s02: "200", s03: "200", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 23, disciple: 'Lithium', code:"CVL", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 24, disciple: 'Beryllium', code:"MECH", s01: "100", s02: "200", s03: "NA", s04: "300", s05: "400", s06: "400", s07: "400", s08: "500", s09: "200"},
  {position: 25, disciple: 'Boron', code:"ELE", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 26, disciple: 'Carbon', code:"PLU", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "400", s07: "400", s08: "500", s09: "200"},
  {position: 27, disciple: 'Nitrogen', code:"FIRE", s01: "100", s02: "NA", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 28, disciple: 'Oxygen', code:"LS", s01: "100", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "NA", s08: "500", s09: "200"},
  {position: 29, disciple: 'Fluorine', code:"FIX", s01: "100", s02: "200", s03: "NA", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
  {position: 30, disciple: 'Neon', code:"FURN", s01: "NA", s02: "200", s03: "300", s04: "300", s05: "400", s06: "NA", s07: "400", s08: "500", s09: "200"},
];