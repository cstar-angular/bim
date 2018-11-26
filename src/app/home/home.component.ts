import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ProjectprofileService } from '../projectprofile/projectprofile.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects;

  constructor(
    private router: Router,
    private projectService: ProjectprofileService
  ) { }

  ngOnInit() {
    this.projects = this.projectService.getProjectsList().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  gotourl(url) {
    this.router.navigate([url]);
  }

}
