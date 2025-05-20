import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  @Input() activeDate: Date = new Date();
  @Input() disabledDates: Date[] = [];

  // ✅ 新增 anchorDay 與 disableBeforeAnchor
  @Input() anchorDay: Date = new Date();
  @Input() disableBeforeAnchor: boolean = true;

  @Output() dateSelected = new EventEmitter<Date>();

  currentDate: Date = new Date();
  weeks: any[] = [];
  years: number[] = [];
  weekdays: string[] = ['日', '一', '二', '三', '四', '五', '六'];

  ngOnInit(): void {
    this.currentDate = new Date(this.activeDate);
    this.generateCalendar();
    this.generateYears();
    console.log('activeDate', this.activeDate);
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 21 }, (_, i) => currentYear + i);
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  isBefore(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() < d2.getTime();
  }

  isDisabled(date: Date): boolean {
    // 若有設定 disableBeforeAnchor，則小於 anchorDay 的日期視為 disabled
    const beforeAnchor = this.disableBeforeAnchor && this.isBefore(date, this.anchorDay);
    const inDisabledList = this.disabledDates.some(d => this.isSameDate(d, date));
    return beforeAnchor || inDisabledList;
  }

  isActive(date: Date): boolean {
    return this.isSameDate(this.activeDate, date);
  }

  generateCalendar() {
    const start = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    const startDay = start.getDay();
    const daysInMonth = end.getDate();

    const calendar: Date[] = [];

    // 前一個月尾部
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i - 1);
      calendar.push(d);
    }

    // 本月日期
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i));
    }

    // 下一個月補滿 6 週（42 格）
    while (calendar.length < 42) {
      const last = new Date(calendar[calendar.length - 1]);
      last.setDate(last.getDate() + 1);
      calendar.push(last);
    }

    this.weeks = [];
    for (let i = 0; i < calendar.length; i += 7) {
      this.weeks.push(calendar.slice(i, i + 7));
    }
  }

  prevMonth(event: Event) {
    event.stopPropagation();
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(event: Event) {
    event.stopPropagation();
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  onYearChange(event: any) {
    const newYear = +event.target.value;
    this.currentDate.setFullYear(newYear);
    this.generateCalendar();
  }

  selectDate(date: Date) {
    if (this.isDisabled(date)) return;
    this.activeDate = new Date(date);
    this.dateSelected.emit(this.activeDate);
  }
}
