import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { UpgradeService } from '../_services/upgrade.service';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  value: number = 5;
  options: Options = {
    floor: 5,
    ceil: 30,
    step: 5,
    showTicks: true,
    showTicksValues: true
  };

  constructor(
    private upgradeService: UpgradeService
  ) {
    this.upgradeService.getAuth();
   }

  ngOnInit() {
  }

}
