import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../../../_services/database.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  @Input() projectid;
  @Input() memberid;

  organizer;

  roles = [
    {key: 0, val: 'Owner'},
    {key: 1, val: 'Architect'},
    {key: 2, val: 'Engineer'},
    {key: 3, val: 'BIM Manager'},
    {key: 4, val: 'BIM Coordinartor'},
    {key: 5, val: 'BIM Modeller'},
    {key: 6, val: 'Cost Estimator'},
    {key: 7, val: 'MEP Engineer'},
    {key: 8, val: 'Structural Engineer'},
    {key: 9, val: 'Landscape Designer'},
    {key: 10, val: 'Project Manager'}
  ];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    
    if (this.memberid) {
      this.databaseService.getRowDetails('/teams/' + this.projectid, this.memberid).valueChanges().subscribe(data => {
        if (data) {
          this.organizer = data;
        }
      });
    }
    
  }

}
