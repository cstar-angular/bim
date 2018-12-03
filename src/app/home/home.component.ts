import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ProjectprofileService } from '../projectprofile/projectprofile.service';
import { AuthService } from '../_services/auth.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects;
  currentUser = this.authService.getAuthUser();

  constructor(
    private router: Router,
    private projectService: ProjectprofileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.projects = this.projectService.getProjectsList().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() })).filter(proj => proj.created_by == this.currentUser.uid)
      )
    );
  }

  gotourl(url) {
    this.router.navigate([url]);
  }

}
