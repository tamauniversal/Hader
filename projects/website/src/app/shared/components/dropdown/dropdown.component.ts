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

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [OverlayModule, CommonModule]
})
export class DropdownComponent implements OnInit, AfterViewInit {
  @Input() triggerClass: string = '';
  @Input() options: DropdownOption[] = [];
  @Input() defaultText = '請選擇';
  @Input() disabled = false;
  @Input() error = false;

  @Output() selectionChange = new EventEmitter<DropdownOption>();

  @ViewChild('dropdownButton', { static: false }) buttonRef!: ElementRef;
  @ViewChild('origin') originRef!: CdkOverlayOrigin;

  selectedOption: DropdownOption | null = null;
  isOpen = false;
  triggerWidth = 0;
  isBrowser: boolean;

  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.updateTriggerWidth();
        this.cd.markForCheck();
      });
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      try {
        if (this.buttonRef?.nativeElement) {
          this.triggerWidth = this.buttonRef.nativeElement.offsetWidth || 300;
          this.cd.detectChanges();
        }

        setTimeout(() => {
          if (this.buttonRef?.nativeElement) {
            this.triggerWidth = this.buttonRef.nativeElement.offsetWidth || 300;
            this.cd.markForCheck();
          }
        }, 50);
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

  updateTriggerWidth(): number {
    if (this.isBrowser && this.buttonRef && this.buttonRef.nativeElement) {
      try {
        const width = this.buttonRef.nativeElement.offsetWidth || 300;
        this.triggerWidth = width;
        return width;
      } catch (error) {
        console.error('Error updating trigger width:', error);
        return 300;
      }
    }
    return this.triggerWidth || 300;
  }

  toggle() {
    if (this.disabled) {
      return;
    }

    if (!this.isOpen && this.isBrowser && this.buttonRef?.nativeElement) {
      this.triggerWidth = this.buttonRef.nativeElement.offsetWidth || 300;
      this.cd.detectChanges();

      this.isOpen = true;
    } else {
      this.isOpen = !this.isOpen;
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
}
