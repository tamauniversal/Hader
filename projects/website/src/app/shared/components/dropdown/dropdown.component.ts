import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  OnInit
} from '@angular/core';
import { OverlayModule, CdkOverlayOrigin, ConnectedPosition, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface DropdownOption {
  value: string | number;
  label: string;
}

export interface ErrorTooltipOptions {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
  showArrow?: boolean;
  showBorder?: boolean;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [OverlayModule, CommonModule]
})
export class DropdownComponent implements OnInit, AfterViewInit {
  @Input() options: DropdownOption[] = [];
  @Input() defaultText = '請選擇';
  @Input() disabled = false;
  @Input() error = false;
  @Input() errorTooltipOptions?: ErrorTooltipOptions;

  @Output() selectionChange = new EventEmitter<DropdownOption>();

  @ViewChild('dropdownButton', { static: false }) buttonRef!: ElementRef;
  @ViewChild('origin') originRef!: CdkOverlayOrigin;

  selectedOption: DropdownOption | null = null;
  isOpen = false;
  triggerWidth = 0;
  isBrowser: boolean;

  // 定義下拉選單與觸發元素的位置關聯
  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 0,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: 0,
    },
  ];

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // 在初始化時嘗試獲取元素寬度，僅在瀏覽器環境下執行
    if (this.isBrowser) {
      setTimeout(() => {
        this.updateTriggerWidth();
        this.cd.markForCheck();
      });
    }
  }

  ngAfterViewInit() {
    // 確保僅在瀏覽器環境下執行DOM操作
    if (this.isBrowser) {
      try {
        this.updateTriggerWidth();
        this.cd.markForCheck();
      } catch (error) {
        console.error('Error in ngAfterViewInit:', error);
      }
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser) {
      this.updateTriggerWidth();
      this.cd.markForCheck();
    }
  }

  updateTriggerWidth() {
    // 確保僅在瀏覽器環境下執行DOM操作
    if (this.isBrowser && this.buttonRef && this.buttonRef.nativeElement) {
      try {
        // 使用setTimeout確保DOM已經完全渲染
        setTimeout(() => {
          this.triggerWidth = this.buttonRef.nativeElement.offsetWidth;
          this.cd.markForCheck();
        });
      } catch (error) {
        console.error('Error updating trigger width:', error);
      }
    }
  }

  toggle() {
    if (this.disabled) {
      return;
    }
    this.isOpen = !this.isOpen;

    // 每次打開下拉選單時更新寬度
    if (this.isOpen && this.isBrowser) {
      setTimeout(() => {
        this.updateTriggerWidth();
      });
    }

    this.cd.markForCheck();
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.cd.markForCheck();
    }
  }

  selectOption(option: DropdownOption) {
    this.selectedOption = option;
    this.selectionChange.emit(option);
    this.close();
  }

  // 當有 errorTooltipOptions.text 時才使用工具提示，否則使用簡單的錯誤指示器
  showError() {
    if (this.error && this.errorTooltipOptions?.text && this.buttonRef?.nativeElement) {
      // 這裡可以添加顯示工具提示的邏輯，或者讓外部處理
      console.log('顯示錯誤:', this.errorTooltipOptions.text);
    }
  }
}
