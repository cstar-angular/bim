import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SettingsComponent>) {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
