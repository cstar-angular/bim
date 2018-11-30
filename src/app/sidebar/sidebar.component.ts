import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evented, Event } from '../_services/evented';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  activate;
  projectKey;
  r_e;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {
      this.r_e = this.router.events.subscribe((val) => {
        if(val['url']) {
          this.activate = val['url'].split('/')[2];
        }
      });      
    }

  ngOnInit() {
    this.projectKey = localStorage.getItem('pKey');
  }

  gotourl(url){
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.r_e.unsubscribe();
  }

  clickTumb() {
    Evented.fire('clickTumb', {
      val: 'aa'
    });
  }
}
