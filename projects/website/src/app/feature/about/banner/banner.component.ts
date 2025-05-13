import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {
  diseases = [
    '糖尿病','高血壓','心臟病','腎臟病'
  ]

  jobs = [
    '專科醫師','營養師','專科藥師','護理師'
  ]
}
