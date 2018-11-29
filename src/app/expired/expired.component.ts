import { Component, OnInit } from '@angular/core';
import { UpgradeService } from '../_services/upgrade.service';

@Component({
  selector: 'app-expired',
  templateUrl: './expired.component.html',
  styleUrls: ['./expired.component.scss']
})
export class ExpiredComponent implements OnInit {

  constructor(
    private upgradeService: UpgradeService
  ) { 
    
  }

  ngOnInit() {
  }

}
