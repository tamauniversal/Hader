import { Component, ElementRef, ViewChildren, ViewChild, QueryList, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent, DropdownOption } from '../../shared/components/dropdown/dropdown.component';
import { TooltipService, TooltipOptions } from '../../shared/components/tooltip/tooltip.service';
import { CalendarComponent } from "../../shared/components/calendar/calendar.component";
import { CalendarTriggerComponent } from '../../shared/components/calendar-trigger/calendar-trigger.component';

@Component({
  selector: 'app-registration-inquiry',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DropdownComponent, CalendarTriggerComponent],
  templateUrl: './registration-inquiry.component.html',
  styleUrl: './registration-inquiry.component.scss'
})
export class RegistrationInquiryComponent implements OnInit, OnDestroy {
  // 控制當前激活的標籤
  activeTab: 'registration' | 'inquiry' = 'registration';

  // 控制掛號完成狀態
  registrationComplete: boolean = false;

  // 表單提交標記
  registrationSubmitted: boolean = false;
  inquirySubmitted: boolean = false;

  // 確定是否在瀏覽器端執行
  isBrowser: boolean;

  // 獲取表單輸入元素的引用，用於顯示錯誤提示
  @ViewChildren('formInput') formInputs!: QueryList<ElementRef>;

  // 錯誤提示設置
  TooltipOptions: TooltipOptions = {
    position: 'top',
    duration: 5000,
    showArrow: true
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
  selectedTime: string = '';
  today = new Date();

  // 添加對dropdown組件的引用
  @ViewChild('doctorRef') doctorDropdown!: DropdownComponent;
  @ViewChild('birthRef') birthCalendar!: CalendarTriggerComponent;
  @ViewChild('timeRef') timeCalendar!: CalendarTriggerComponent;

  constructor(
    private tooltipService: TooltipService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // 監聽註冊表單字段變化
    this.setupFormControlListeners(this.registrationForm.controls, false);

    // 監聽查詢表單字段變化
    this.setupFormControlListeners(this.inquiryForm.controls, true);
  }

  ngOnDestroy(): void {
    // 組件銷毀時確保隱藏所有tooltip
    if (this.isBrowser) {
      this.tooltipService.hideAll();
    }
  }

  // 設置表單控制項的監聽器
  private setupFormControlListeners(controls: any, isInquiry: boolean): void {
    Object.keys(controls).forEach(key => {
      const control = controls[key];

      // 監聽控制項狀態變化
      control.statusChanges.subscribe((status: string) => {
        // 如果控制項從無效變為有效且已被觸碰過
        if (status === 'VALID' && control.touched) {
          // 獲取對應的DOM元素
          let element: HTMLElement | null = null;

          if (isInquiry) {
            // 查詢表單元素ID格式
            element = document.getElementById(`inquiry_${key}`);
          } else {
            // 註冊表單的特殊處理
            if (key === 'doctor' && this.doctorDropdown?.buttonRef?.nativeElement) {
              element = this.doctorDropdown.buttonRef.nativeElement;
            } else if (key === 'appointmentTime' && this.timeCalendar?.triggerBtn?.nativeElement) {
              element = this.timeCalendar.triggerBtn.nativeElement;
            } else if (key === 'birthday' && this.birthCalendar?.triggerBtn?.nativeElement) {
              element = this.birthCalendar.triggerBtn.nativeElement;
            } else {
              element = document.getElementById(key);
            }
          }

          // 如果找到元素，隱藏對應的tooltip
          if (element) {
            this.tooltipService.hide(element);
          }
        }
      });
    });
  }

  setActiveTab(tab: 'registration' | 'inquiry') {
    this.activeTab = tab;
    this.registrationComplete = false;
    // 切換標籤時重置表單提交標記
    this.registrationSubmitted = false;
    this.inquirySubmitted = false;
    // 隱藏所有tooltip
    this.tooltipService.hideAll();
  }

  // 處理下拉選單選擇變更
  onDoctorSelected(option: DropdownOption): void {
    this.selectedDoctor = option;
    this.registrationForm.controls.doctor.setValue(String(option.value));
  }

  onAppointmentTimeSelected(event: Date): void {
    this.selectedTime = event.toDateString();
    this.registrationForm.controls.appointmentTime.setValue(this.selectedTime);
  }

  onBirthdaySelected(event: Date): void {
    this.registrationForm.controls.birthday.setValue(event.toDateString());
  }

  // 表單提交處理
  onRegistrationSubmit() {
    console.log('onRegistrationSubmit');
    if (!this.isBrowser) return; // SSR環境不執行

    // 設置提交標記
    this.registrationSubmitted = true;

    if (this.registrationForm.valid) {
      // 模擬提交註冊
      console.log('提交註冊', this.registrationForm.value);

      // 顯示註冊資訊
      this.registrationComplete = true;
    } else {
      console.log('註冊表單無效', this.registrationForm.value);
      // 先隱藏所有可能存在的錯誤提示
      this.tooltipService.hideAll();

      // 標記所有欄位為已觸摸，顯示紅框錯誤
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();

        // 如果字段無效，顯示tooltip錯誤提示
        if (control && control.invalid && control.touched) {
          // 生成錯誤信息
          let errorMessage = this.formErrors[key as keyof typeof this.formErrors] || '此欄位無效';
          if(key === 'birthday') {
            console.log('birthday', this.birthCalendar);
          }
          // 針對下拉選單控件特殊處理
          if (key === 'doctor' && this.doctorDropdown?.buttonRef?.nativeElement) {
            // 使用父組件直接獲取下拉框DOM元素並顯示錯誤
            const dropdownElement = this.doctorDropdown.buttonRef.nativeElement;

            // 顯示錯誤tooltip
            this.tooltipService.show(errorMessage, dropdownElement, {
              position: 'bottom',
              duration: 5000,
              showArrow: true,
            });
          } else if (key === 'appointmentTime' && this.timeCalendar?.triggerBtn?.nativeElement) {
            // 使用父組件直接獲取月曆DOM元素並顯示錯誤
            const calendarElement = this.timeCalendar.triggerBtn.nativeElement;

            // 顯示錯誤tooltip
            this.tooltipService.show(errorMessage, calendarElement, {
              position: 'bottom',
              duration: 5000,
              showArrow: true,
            });
          } else if (key === 'birthday' && this.birthCalendar?.triggerBtn?.nativeElement) {
            // 使用父組件直接獲取月曆DOM元素並顯示錯誤
            const calendarElement = this.birthCalendar.triggerBtn.nativeElement;
            console.log('calendarElement', calendarElement);

            // 顯示錯誤tooltip
            this.tooltipService.show(errorMessage, calendarElement, {
              position: 'bottom',
              duration: 5000,
              showArrow: true,
            });
          } else {
            // 其他普通輸入框處理
            const inputElement = document.getElementById(key) as HTMLElement;
            if (inputElement) {
              // 顯示錯誤tooltip
              this.tooltipService.show(errorMessage, inputElement, {
                position: 'bottom',
                duration: 5000,
                showArrow: true,
              });
            }
          }
        }
      });
    }
  }

  onInquirySubmit() {
    if (!this.isBrowser) return; // SSR環境不執行

    // 設置提交標記
    this.inquirySubmitted = true;

    if (this.inquiryForm.valid) {
      // 模擬提交查詢
      console.log('提交查詢', this.inquiryForm.value);
      setTimeout(() => {
        this.registrationComplete = true;
      }, 1000);
    } else {
      // 先隱藏所有可能存在的錯誤提示
      this.tooltipService.hideAll();

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
            this.tooltipService.show(errorMessage, inputElement, {
              position: 'bottom',
              duration: 5000,
              showArrow: true,
            });
          }
        }
      });
    }
  }
}

