import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-banner',
  imports: [RouterModule],
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

  departments = [
    { name: '一般內科', shortName: '內', iconUrl: '/img/common/一般內科.svg' },
    { name: '新陳代謝科', shortName: '代', iconUrl: '/img/common/新陳代謝科.svg' },
    { name: '心臟血管科', shortName: '心', iconUrl: '/img/common/心臟血管科.svg' },
    { name: '腎臟科', shortName: '腎', iconUrl: '/img/common/腎臟科.svg' },
    { name: '兒科', shortName: '兒', iconUrl: '/img/common/兒科.svg' }
  ];
}
