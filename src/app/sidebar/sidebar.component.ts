import { Component, OnInit, ViewChild ,ElementRef, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evented, Event } from '../_services/evented';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { DatabaseService } from '../_services/database.service';
import { ProjectProfile } from '../projectprofile/projectprofile';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  activate;
  projectKey;
  r_e;
  editMod;

  isProgressForuploading = false;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  authUser: firebase.User;

  project = new ProjectProfile();

  @ViewChild('load_project_img') load_project_img: ElementRef;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private afStorage: AngularFireStorage,
    private databaseService: DatabaseService,
    ) {
      this.r_e = this.router.events.subscribe((val) => {
        if(val['url']) {
          this.activate = val['url'].split('/')[2];
          this.projectKey = val['url'].split('/')[3];
        }
      });
    }

  ngOnInit() {
    this.databaseService.getRowDetails('/projects/', this.projectKey).valueChanges().subscribe(data => {
      this.project = data;
    });

    Evented.on('editmod', (e: Event<{mode: boolean}>) => {
      this.editMod = e.args.mode;
    });
  }

  gotourl(url){
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.r_e.unsubscribe();
  }

  popupforImage() {
    this.load_project_img.nativeElement.click();
  }

  handleFileInput(files) {
    if (files.length == 0) {
      return;
    }
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('files/' + this.projectKey+'/images/'+id);
    this.task = this.ref.put(files[0]);
    var me = this;
    this.isProgressForuploading = true;
    this.task.then(function (data) {
      
      var a = data.ref.getDownloadURL();
      a.then(function (data) {
        Evented.fire('updateProjectImage', {
          imgUrl: data
        });
      });
    });   
  }
}
