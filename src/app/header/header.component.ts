import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SettingsComponent } from '../settings/settings.component'
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  url = '';
  isAuth = false;
  
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.router.events.subscribe((val) => {
      this.url = val['url'];
    });
  }

  ngOnInit() {
    this.isAuth = this.authService.isAuth();
  }

  ngAfterViewChecked() {
    this.isAuth = this.authService.isAuth();
  }

  gotourl(url){
    this.router.navigate([url]);
  }

  openDialog(): void {
    // 
    const dialogRef = this.dialog.open(SettingsComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
