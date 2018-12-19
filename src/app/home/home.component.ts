import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ProjectprofileService } from '../projectprofile/projectprofile.service';
import { DatabaseService } from '../_services/database.service';
import { AuthService } from '../_services/auth.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects = [];
  invitedProjects = [];
  currentUser = this.authService.getAuthUser();
  maxCount = 1;

  constructor(
    private router: Router,
    private projectService: ProjectprofileService,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) { 
    if (this.currentUser) {
      this.databaseService.getRowDetails('/users', this.currentUser.uid).valueChanges().subscribe(data => {
        
        if (data && data.membership) {
          this.currentUser = data;
          this.maxCount = this.currentUser.membership.type;
        }
      });
    }
  }

  ngOnInit() {
    // Decide the project count by membership
    

    this.projectService.getProjectsList().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() })).filter(proj => (proj.created_by == this.currentUser.uid && !proj.is_archive))
      )
    ).subscribe(data => {
      if(data) {
        
        // Check the count of the projects
        if (data.length > this.maxCount) {
          var projects = [];

          data.forEach(item => {
            
            if (projects.length < this.maxCount) {
              projects.push(item);
            }

          });

          this.projects = projects;

        } else {

          this.projects = data;
          var moreCount = this.maxCount - this.projects.length;

          // Add the invited projects
          this.databaseService.getLists('/user-project').snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({ key: c.payload.key, ...c.payload.val() })).filter(data => data.userid == this.currentUser.uid)
            )
          ).subscribe(data => {
            if (data) {
              this.invitedProjects = [];
              data.forEach(item => {
                this.databaseService.getRowDetails('/projects', item.projectid).valueChanges().subscribe(project => {
                  project.key = item.projectid;

                  if (this.invitedProjects.length < moreCount) {
                    this.invitedProjects.push(project);
                  }
                  
                });
                
              });
            }
          });

        }

      }
    });
    
  }

  gotourl(url) {
    if (url == '/project/new') {
      if ( this.maxCount <= (this.projects.length + this.invitedProjects.length) ) {
        this.router.navigate(['/upgrade']);console.log(this.maxCount <= (this.projects.length + this.invitedProjects.length));
        return;
      } else {
        // this.router.navigate([url]);
      }      
    } else {
      // this.router.navigate([url]);
    }
    this.router.navigate([url]);
  }

}
