import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  url = '';

  constructor(
    private router: Router
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

}
