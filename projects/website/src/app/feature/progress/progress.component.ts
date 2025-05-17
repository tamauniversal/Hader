import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit {
  currentDate: string;
  currentTime: string;
  doctors: { department: string; name: string; number: number | null }[] = [];

  constructor() {
    const now = new Date();
    this.currentDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    this.currentTime = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true });
    this.currentTime = this.currentTime.replace('AM', 'A.M.').replace('PM', 'P.M.');
  }

  ngOnInit(): void {
    this.getDoctorStatus();
  }

  getDoctorStatus() {
    const initialDoctors = [
      { department: '心臟血管科', name: '江孟修醫師', number: 29 },
      { department: '一般內科', name: '陳大文醫師', number: 15 },
      // { department: '兒科', name: '李小明醫師', number: 4 },
    ]

    // 確保資料必定有三筆，若不足則補足，若超過則只取前三筆
    this.doctors = initialDoctors.slice(0, 3);
    while (this.doctors.length < 3) {
      this.doctors.push({ department: '', name: '', number: null });
    }
  }
}
