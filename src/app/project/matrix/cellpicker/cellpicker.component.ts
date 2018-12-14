import { Component, OnInit, Input, HostListener  } from '@angular/core';
import { DatabaseService } from '../../../_services/database.service';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-cellpicker',
  templateUrl: './cellpicker.component.html',
  styleUrls: ['./cellpicker.component.scss']
})
export class CellpickerComponent implements OnInit {

  @Input() element;
  @Input() lod;
  @Input() isAdmin;
  @Input() projectId;
  @Input() configureId;
  @Input() currentUser;

  isOpen = false;

  constructor(
    private databaseService: DatabaseService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    // document.addEventListener('click', this.onDocumentClick.bind(this), true);
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  onDocumentClick(event) {
    this.isOpen = false;
  }

  ngOnDestroy(){
    // document.removeEventListener('click', this.onDocumentClick, false);  
  }

  getShowTextColor() {
    var styles = {
      'background': 'rgb(38, 38, 38)',
      'color': 'white'
    };

    if(this.element.matrix[this.lod.key].status == "NA") {
      switch(this.element.matrix[this.lod.key].priority) {
        case 'High':
          styles.background = 'rgb(38, 38, 38)';
          styles.color = 'white';
          break;
        case 'Medium':
          styles.background = 'rgb(128, 128, 128)';
          styles.color = 'black';
          break;
        case 'Low':
          styles.background = 'rgb(217, 217, 217)';
          styles.color = 'black';
          break;
        case 'NA':
          styles.background = 'rgb(255, 255, 255)';
          styles.color = 'black';
          break;
      }
    } else {
      switch(this.element.matrix[this.lod.key].status) {
        case 'Done':
          styles.background = 'rgb(84, 130, 53)';
          styles.color = 'white';
          break;
        case 'In progress':
          styles.background = 'rgb(0, 112, 192)';
          styles.color = 'white';
          break;
        case 'NA':
          styles.background = 'rgb(255, 255, 255)';
          styles.color = 'black';
          break;
      }
    }
    return styles;
  }

  changeStatus(status) {
    this.toggle();
    var path = '/matrix/' + this.projectId + '/' + this.configureId + '/' + this.element.key + '/' + this.lod.key;
    var data = this.element.matrix[this.lod.key];
    if(!this.isAdmin) {
      data.status = status;
    } else {
      data.priority = status;
    }
    
    this.databaseService.createRowWithKey(path, data);

    var notificationData = {
      "sender": this.currentUser.uid,
      "type": "add",
      "message": "The new Meeting was added.",
      "project": this.projectId
    }
    this.apiService.sendRequest('sendNotification', notificationData).subscribe(result => {});
  }

}
