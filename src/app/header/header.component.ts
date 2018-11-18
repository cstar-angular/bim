import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  url = '';
  
  constructor(
    private router: Router,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((val) => {
      this.url = val['url'];
    });
  }

  ngOnInit() {
  }

  gotourl(url){
    this.router.navigate([url]);
  }

  openDialog(): void {
    // 
  }
}
