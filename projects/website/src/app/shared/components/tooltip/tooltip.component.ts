import { Component, Input, OnDestroy, ElementRef, TemplateRef, ViewChild } from '@angular/core';
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
  template: `
    <div class="tooltip-container">
      <div class="tooltip-content">
        {{ message }}
      </div>
      <div *ngIf="showArrow" class="tooltip-arrow" [ngClass]="'arrow-' + position"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .tooltip-container {
      position: relative;
    }
    .tooltip-content {
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      max-width: 250px;
      word-wrap: break-word;
    }
    .tooltip-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border: 6px solid transparent;
    }
    .tooltip-arrow.arrow-top {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: rgba(0, 0, 0, 0.8);
      border-top: 0;
    }
    .tooltip-arrow.arrow-right {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: rgba(0, 0, 0, 0.8);
      border-right: 0;
    }
    .tooltip-arrow.arrow-bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: rgba(0, 0, 0, 0.8);
      border-bottom: 0;
    }
    .tooltip-arrow.arrow-left {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: rgba(0, 0, 0, 0.8);
      border-left: 0;
    }
  `]
})
export class TooltipContentComponent {
  message: string = '';
  position: TooltipPosition = 'top';
  showArrow: boolean = true;
}

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  template: '<ng-content></ng-content>',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent implements OnDestroy {
  @Input() message: string = '';
  @Input() position: TooltipPosition = 'top';
  @Input() autoHideTime: number = 0; // 0表示不自動隱藏
  @Input() showArrow: boolean = true;

  private overlayRef: OverlayRef | null = null;
  private hideTimeout: any = null;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef
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
      hasBackdrop: false
    });

    // 創建內容
    const tooltipPortal = new ComponentPortal(TooltipContentComponent);
    const tooltipRef = this.overlayRef.attach(tooltipPortal);

    // 設置內容屬性
    tooltipRef.instance.message = this.message;
    tooltipRef.instance.position = this.position;
    tooltipRef.instance.showArrow = this.showArrow;

    // 設置自動隱藏
    if (this.autoHideTime > 0) {
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
          offsetY: -8
        });
        // 備用位置 - 底部
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8
        });
        break;
      case 'right':
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8
        });
        // 備用位置 - 左側
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8
        });
        break;
      case 'bottom':
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8
        });
        // 備用位置 - 頂部
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8
        });
        break;
      case 'left':
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8
        });
        // 備用位置 - 右側
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8
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
        offsetY: -8
      },
      // 右側
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 8
      },
      // 下方
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8
      },
      // 左側
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -8
      }
    );

    return this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(true);  // 確保 tooltip 保持在視窗內
  }
}
