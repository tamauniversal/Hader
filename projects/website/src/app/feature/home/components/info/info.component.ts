import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-info',
  imports: [RouterModule, CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  newsList = [
    { date: "2025.03.01", title: "哈德診所即將於4月3日為您服務", url: "/news" },
    { date: "2025.02.20", title: "哈德診所心臟血管專科醫師入駐", url: "/news" },
    { date: "2025.01.02", title: "行政人員招募中", url: "/news" },
    { date: "2025.02.20", title: "心臟血管專科醫師入駐", url: "/news" },
    { date: "2025.01.02", title: "專業護理人員招募中", url: "/news" }
  ];

  educationList = [
    { tag: "日常\n保健", title: "飲食均衡\n教你怎麼吃", imgUrl: "/img/common/people-1.svg", url: "/education" },
    { tag: "醫療\n新知", title: "關於流感疫苗\n你知道多少?", imgUrl: "/img/common/people-2.svg", url: "/education"}
  ]
}
