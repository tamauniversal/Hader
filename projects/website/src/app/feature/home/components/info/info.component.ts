import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EducationCardComponent } from "../../../../shared/components/education-card/education-card.component";
import { EducationCardType } from '../../../../shared/components/education-card/education-card.interface';

@Component({
  selector: 'app-info',
  imports: [RouterModule, CommonModule, EducationCardComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  newsList = [
    { date: "2025.03.01", title: "哈德診所即將於4月3日為您服務", url: "/news/1" },
    { date: "2025.02.20", title: "哈德診所心臟血管專科醫師入駐", url: "/news/2" },
    { date: "2025.01.02", title: "行政人員招募中", url: "/news/3" },
    { date: "2025.02.20", title: "心臟血管專科醫師入駐", url: "/news/4" },
    { date: "2025.01.02", title: "專業護理人員招募中", url: "/news/5" }
  ];

  educationList = [
    { tag: "日常\n保健", title: "飲食均衡\n教你怎麼吃", type: EducationCardType.TYPE_1, url: "/education/detail/1" },
    { tag: "醫療\n新知", title: "關於流感疫苗\n你知道多少?", type: EducationCardType.TYPE_2, url: "/education/detail/2"}
  ]
}
