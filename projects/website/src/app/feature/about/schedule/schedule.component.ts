import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Doctor {
  id: number;
  shortName: string;
}

interface ScheduleItem {
  doctorIds: number[]; // 使用陣列存儲多個醫生ID
  dayOfWeek: number; // 1-6 對應週一到週六
  timeSlot: 'morning' | 'afternoon';
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  currentWeekStart: Date = new Date();
  currentWeekEnd: Date = new Date();
  initialWeekStart: Date = new Date(); // 記錄初始週的開始日期
  maxFutureWeeks: number = 8; // 最多往後8週

  // 控制按鈕顯示
  canGoToPreviousWeek: boolean = false;
  canGoToNextWeek: boolean = true;

  // 醫生列表：內科、代謝科、心臟科、腎臟科、兒科
  doctors: Doctor[] = [
    { id: 1, shortName: '內' },
    { id: 2, shortName: '代' },
    { id: 3, shortName: '心' },
    { id: 4, shortName: '腎' },
    { id: 5, shortName: '兒' }
  ];

  // 排班資料 - 實際應用中可從服務獲取
  scheduleItems: ScheduleItem[] = [];

  // 格式化日期為 MM/DD
  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}`;
  }

  // 獲取當前週的日期範圍
  get weekDateRange(): string {
    return `${this.formatDate(this.currentWeekStart)}-${this.formatDate(this.currentWeekEnd)}`;
  }

  // 切換到前一週
  previousWeek(): void {
    if (!this.canGoToPreviousWeek) return;

    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    this.setWeekRange(newStart);
    this.generateSchedule();
    this.updateNavigationButtons();
  }

  // 切換到下一週
  nextWeek(): void {
    if (!this.canGoToNextWeek) return;

    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    this.setWeekRange(newStart);
    this.generateSchedule();
    this.updateNavigationButtons();
  }

  // 更新導航按鈕狀態
  private updateNavigationButtons(): void {
    // 檢查是否可以向前導航（不能早於初始週）
    const initialWeekTime = this.initialWeekStart.getTime();
    const currentWeekTime = this.currentWeekStart.getTime();
    this.canGoToPreviousWeek = currentWeekTime > initialWeekTime;

    // 檢查是否可以向後導航（不能超過最大未來週數）
    const maxFutureDate = new Date(this.initialWeekStart);
    maxFutureDate.setDate(maxFutureDate.getDate() + (this.maxFutureWeeks * 6));
    this.canGoToNextWeek = currentWeekTime < maxFutureDate.getTime();
  }

  // 設置週的開始和結束日期
  private setWeekRange(startDate: Date): void {
    this.currentWeekStart = new Date(startDate);
    // 確保開始日期是週一
    const day = this.currentWeekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day; // 如果是週日，則-6，否則為1-當前天
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + diff);

    // 計算週末日期（週六）
    this.currentWeekEnd = new Date(this.currentWeekStart);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 5);
  }

  // 獲取指定日期、時段的醫生ID列表
  getDoctorsForSlot(dayOfWeek: number, timeSlot: 'morning' | 'afternoon'): number[] {
    const item = this.scheduleItems.find(
      item => item.dayOfWeek === dayOfWeek && item.timeSlot === timeSlot
    );
    return item ? item.doctorIds : [];
  }

  // 獲取醫生名稱
  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? doctor.shortName : '休';
  }

  // 判斷時段是否為休診（沒有任何醫生）
  isSlotEmpty(dayOfWeek: number, timeSlot: 'morning' | 'afternoon'): boolean {
    const doctors = this.getDoctorsForSlot(dayOfWeek, timeSlot);
    return doctors.length === 0;
  }

  // 生成排班表 - 實際應用時可由API獲取
  private generateSchedule(): void {
    // 清空現有排班
    this.scheduleItems = [];

    // 獲取當前週的開始時間戳，用於確定是哪一週
    const weekStartTimestamp = this.currentWeekStart.getTime();

    // 根據週次生成不同的排班
    // 這裡只是示範，實際應用中應該從後端獲取真實排班數據

    // 為每天安排醫生
    for (let day = 1; day <= 6; day++) {
      // 根據週次和日期設置不同排班
      // 模擬一些固定和輪班的模式

      // 上午時段
      const morningDoctorIds = this.getMockDoctorIds(weekStartTimestamp, day, 'morning');
      this.scheduleItems.push({
        doctorIds: morningDoctorIds,
        dayOfWeek: day,
        timeSlot: 'morning'
      });

      // 下午時段
      const afternoonDoctorIds = this.getMockDoctorIds(weekStartTimestamp, day, 'afternoon');
      this.scheduleItems.push({
        doctorIds: afternoonDoctorIds,
        dayOfWeek: day,
        timeSlot: 'afternoon'
      });
    }
  }

  // 獲取模擬的醫生ID陣列（實際應用中應從API獲取）
  private getMockDoctorIds(weekTimestamp: number, day: number, timeSlot: 'morning' | 'afternoon'): number[] {
    // 根據週數選擇不同的排班模式
    const weekNumber = Math.floor(
      (weekTimestamp - this.initialWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    // 模擬一些固定和輪換的排班模式，包含多位醫生的情況
    if (timeSlot === 'morning') {
      // 上午時段的排班規則
      switch (day) {
        case 1: // 週一
          return weekNumber % 2 === 0 ? [1, 3] : [2, 5]; // 輪流安排兩位醫生
        case 2: // 週二
          return weekNumber % 2 === 0 ? [3, 4] : [1, 5]; // 心臟科+腎臟科和內科+兒科輪流
        case 3: // 週三
          return [1, 2, 3]; // 固定為內科、代謝科、心臟科同時出診
        case 4: // 週四
          return []; // 休診
        case 5: // 週五
          return [4, 5]; // 固定為腎臟科和兒科
        case 6: // 週六
          return weekNumber % 2 === 0 ? [2] : []; // 隔週休診
        default:
          return [];
      }
    } else {
      // 下午時段的排班規則
      switch (day) {
        case 1: // 週一
          return [2, 4]; // 固定為代謝科和腎臟科
        case 2: // 週二
          return weekNumber % 2 === 0 ? [] : [3, 5]; // 隔週休診或心臟科+兒科
        case 3: // 週三
          return [1, 5]; // 固定為內科和兒科
        case 4: // 週四
          return [3]; // 固定為心臟科
        case 5: // 週五
          return [(weekNumber % 3) + 1, 4]; // 輪流安排前三位醫生之一加腎臟科
        case 6: // 週六
          return []; // 固定休診
        default:
          return [];
      }
    }
  }

  ngOnInit(): void {
    // 設置當前週和初始週
    this.setWeekRange(new Date());
    this.initialWeekStart = new Date(this.currentWeekStart);
    this.generateSchedule();
    this.updateNavigationButtons();
  }
}
