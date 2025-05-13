import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  fragment?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuOpen = false;

  navItems: NavItem[] = [
    { path: '/about', label: '關於哈德' },
    { path: '/about', label: '門診時間表', fragment: 'schedule' },
    { path: '/registration-inquiry', label: '掛號及查詢' },
    { path: '/fees', label: '收費標準' },
    { path: '/progress', label: '看診進度' },
    { path: '/education', label: '衛教資訊' },
    { path: '/news', label: '最新消息' },
    { path: '/contact', label: '聯絡我們' }
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
