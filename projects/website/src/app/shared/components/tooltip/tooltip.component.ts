import { Component, Input, OnDestroy, ElementRef, ViewChild, ApplicationRef, HostBinding, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Overlay,
  OverlayModule,
  OverlayRef,
  OverlayPositionBuilder,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-tooltip-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TooltipContentComponent {
  message: string = '';
  position: TooltipPosition = 'top';
  showArrow: boolean = true;
  isError: boolean = false;

  @HostBinding('class') get hostClass() {
    return this.isError ? 'tooltip-error' : '';
  }
}

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  template: '<ng-content></ng-content>',
  styleUrl: './tooltip.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TooltipComponent implements OnDestroy {
  @Input() message: string = '';
  @Input() position: TooltipPosition = 'top';
  @Input() autoHideTime: number = 0; // 0表示不自動隱藏
  @Input() showArrow: boolean = true;
  @Input() isError: boolean = false;

  private overlayRef: OverlayRef | null = null;
  private hideTimeout: any = null;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private appRef: ApplicationRef
  ) {}

  ngOnDestroy(): void {
    this.hide();
  }

  show(): void {
    // 先隱藏已存在的tooltip
    this.hide();

    // 設置位置策略
    const positionStrategy = this.getPositionStrategy();

    // 創建overlay
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: ['tooltip-overlay', this.isError ? 'tooltip-error-overlay' : '']
    });

    // 創建內容
    const tooltipPortal = new ComponentPortal(TooltipContentComponent);
    const tooltipRef = this.overlayRef.attach(tooltipPortal);

    // 設置內容屬性
    tooltipRef.instance.message = this.message;
    tooltipRef.instance.position = this.position;
    tooltipRef.instance.showArrow = this.showArrow;
    tooltipRef.instance.isError = this.isError;

    // 強制觸發變更檢測
    this.appRef.tick();

    // 確保tooltip位置正確
    setTimeout(() => {
      if (this.overlayRef) {
        this.overlayRef.updatePosition();
      }
    }, 0);

    // 設置自動隱藏
    if (this.autoHideTime > 0) {
      // 清除之前的計時器
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }

      // 設置新的計時器
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, this.autoHideTime);
    }
  }

  hide(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  toggle(): void {
    if (this.overlayRef) {
      this.hide();
    } else {
      this.show();
    }
  }

  private getPositionStrategy(): FlexibleConnectedPositionStrategy {
    // 定義各個位置的設置
    const positions: ConnectedPosition[] = [];

    // 根據指定位置添加主要位置
    switch (this.position) {
      case 'top':
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: 0
        });
        // 備用位置 - 底部
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 0
        });
        break;
      case 'right':
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 0
        });
        // 備用位置 - 左側
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: 0
        });
        break;
      case 'bottom':
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 0
        });
        // 備用位置 - 頂部
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: 0
        });
        break;
      case 'left':
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: 0
        });
        // 備用位置 - 右側
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 0
        });
        break;
    }

    // 添加更多備用位置，以確保總是能找到一個合適的位置
    positions.push(
      // 上方
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: 0
      },
      // 右側
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 0
      },
      // 下方
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 0
      },
      // 左側
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: 0
      }
    );

    return this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(true);  // 確保 tooltip 保持在視窗內
  }
}
