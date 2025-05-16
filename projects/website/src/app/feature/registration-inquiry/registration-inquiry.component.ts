import { Component, ElementRef, ViewChildren, QueryList, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownComponent, DropdownOption } from '../../shared/components/dropdown/dropdown.component';
import { TooltipService, ErrorTooltipOptions } from '../../shared/components/tooltip/tooltip.service';

interface OptionItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-registration-inquiry',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DropdownComponent],
  templateUrl: './registration-inquiry.component.html',
  styleUrl: './registration-inquiry.component.scss'
})
export class RegistrationInquiryComponent {
  // 控制當前激活的標籤
  activeTab: 'registration' | 'inquiry' = 'registration';

  // 控制掛號完成狀態
  registrationComplete: boolean = false;

  // 確定是否在瀏覽器端執行
  isBrowser: boolean;

  // 獲取表單輸入元素的引用，用於顯示錯誤提示
  @ViewChildren('formInput') formInputs!: QueryList<ElementRef>;

  // 錯誤提示設置
  errorTooltipOptions: ErrorTooltipOptions = {
    position: 'top',
    duration: 5000,
    showArrow: true,
    showBorder: true
  };

  // 科別/醫師下拉選單選項
  doctorOptions: DropdownOption[] = [
    { value: 'internal-wang', label: '內科 - 王醫師' },
    { value: 'internal-li', label: '內科 - 李醫師' },
    { value: 'surgery-chen', label: '外科 - 陳醫師' },
    { value: 'pediatrics-zhang', label: '兒科 - 張醫師' },
    { value: 'gynecology-lin', label: '婦科 - 林醫師' }
  ];

  // 預約時間下拉選單選項
  appointmentTimeOptions: DropdownOption[] = [
    { value: '2023-06-01-morning', label: '2023/06/01 上午' },
    { value: '2023-06-01-afternoon', label: '2023/06/01 下午' },
    { value: '2023-06-02-morning', label: '2023/06/02 上午' },
    { value: '2023-06-02-afternoon', label: '2023/06/02 下午' },
    { value: '2023-06-03-morning', label: '2023/06/03 上午' }
  ];

  // 表單錯誤訊息
  formErrors = {
    name: '請輸入姓名',
    birthday: '請選擇生日',
    phone: '請輸入聯絡電話',
    idNumber: '請輸入身分證/居留證號',
    doctor: '請選擇科別/醫師',
    appointmentTime: '請選擇預約時間'
  };

  // 表單控制項
  registrationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    idNumber: new FormControl('', Validators.required),
    doctor: new FormControl('', Validators.required),
    appointmentTime: new FormControl('', Validators.required),
  });

  inquiryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    idNumber: new FormControl('', Validators.required),
  });

  // 選中的醫師和時間
  selectedDoctor: DropdownOption | null = null;
  selectedTime: DropdownOption | null = null;

  constructor(
    private router: Router,
    private tooltipService: TooltipService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setActiveTab(tab: 'registration' | 'inquiry') {
    this.activeTab = tab;
    this.registrationComplete = false;
  }

  // 處理下拉選單選擇變更
  onDoctorSelected(option: DropdownOption) {
    this.selectedDoctor = option;
    this.registrationForm.controls.doctor.setValue(String(option.value));
  }

  onTimeSelected(option: DropdownOption) {
    this.selectedTime = option;
    this.registrationForm.controls.appointmentTime.setValue(String(option.value));
  }

  // 表單提交處理
  onRegistrationSubmit() {
    if (!this.isBrowser) return; // SSR環境不執行

    if (this.registrationForm.valid) {
      // 模擬提交註冊
      console.log('提交註冊', this.registrationForm.value);

      // 顯示註冊資訊
      this.registrationComplete = true;
    } else {
      // 先隱藏所有可能存在的錯誤提示
      this.tooltipService.hide();

      // 標記所有欄位為已觸摸，顯示紅框錯誤
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();

        // 如果字段無效，顯示tooltip錯誤提示
        if (control && control.invalid && control.touched) {
          const inputElement = document.getElementById(key) as HTMLElement;
          if (inputElement) {
            // 生成錯誤信息
            let errorMessage = this.formErrors[key as keyof typeof this.formErrors] || '此欄位無效';

            // 顯示錯誤tooltip（在元素下方顯示）
            this.tooltipService.showError(errorMessage, inputElement, {
              position: 'bottom',
              duration: 5000,
              showArrow: true
            });
          }
        }
      });
    }
  }

  onInquirySubmit() {
    if (!this.isBrowser) return; // SSR環境不執行

    if (this.inquiryForm.valid) {
      // 模擬提交查詢
      console.log('提交查詢', this.inquiryForm.value);
      setTimeout(() => {
        this.registrationComplete = true;
      }, 1000);
    } else {
      // 先隱藏所有可能存在的錯誤提示
      this.tooltipService.hide();

      // 標記所有欄位為已觸摸，顯示紅框錯誤
      Object.keys(this.inquiryForm.controls).forEach(key => {
        const control = this.inquiryForm.get(key);
        control?.markAsTouched();

        // 如果字段無效，顯示tooltip錯誤提示
        if (control && control.invalid && control.touched) {
          const inputElement = document.getElementById(`inquiry_${key}`) as HTMLElement;
          if (inputElement) {
            // 生成錯誤信息
            let errorMessage = this.formErrors[key as keyof typeof this.formErrors] || '此欄位無效';

            // 顯示錯誤tooltip（在元素下方顯示）
            this.tooltipService.showError(errorMessage, inputElement, {
              position: 'bottom',
              duration: 5000,
              showArrow: true
            });
          }
        }
      });
    }
  }

  goToStandards() {
    if (this.isBrowser) {
      this.router.navigate(['/fees']);
    }
  }
}

