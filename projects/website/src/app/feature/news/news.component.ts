import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease')]),
    ]),
  ],
})
export class NewsComponent {
  newsList = [
    {
      date: '2025.03.01',
      title: '哈德診所即將於4月3日為您服務',
      content:
        '診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容',
    },
    {
      date: '2025.02.20',
      title: '哈德診所心臟血管專科醫師入駐',
      content:
        '診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容',
    },
    {
      date: '2025.01.02',
      title: '行政人員招募中',
      content:
        '診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容',
    },
    {
      date: '2025.02.20',
      title: '心臟血管專科醫師入駐',
      content:
        '診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容',
    },
    {
      date: '2025.01.02',
      title: '專業護理人員招募中',
      content:
        '診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容診所新聞內容',
    },
  ];

  expandedItems = new Set<any>();
  onlyOneExpanded = true;
  viewFinished = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const indexStr = this.route.snapshot.paramMap.get('id');
    const index = indexStr !== null ? parseInt(indexStr, 10) - 1 : null;

    if (index !== null && !isNaN(index) && index >= 0 && index < this.newsList.length) {
      if (this.onlyOneExpanded) {
        this.expandedItems.clear();
      }
      this.expandedItems.add(index);
    }

    setTimeout(() => {
      this.viewFinished = true;
    }, 0);
  }

  toggleItem(item: any) {
    const isExpanded = this.expandedItems.has(item);

    if (this.onlyOneExpanded) {
      this.expandedItems.clear();
      if (!isExpanded) {
        this.expandedItems.add(item);
      }
    } else {
      if (isExpanded) {
        this.expandedItems.delete(item);
      } else {
        this.expandedItems.add(item);
      }
    }
  }

  isExpanded(item: any): boolean {
    return this.expandedItems.has(item);
  }
}
