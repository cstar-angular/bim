import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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
