import {
  Injectable,
  Injector,
  ApplicationRef,
  ComponentRef,
  ElementRef
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  OverlayPositionBuilder,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipContentComponent, TooltipPosition } from './tooltip.component';

/**
 * 錯誤提示設置選項
 */
export interface ErrorTooltipOptions {
  position?: TooltipPosition;  // 提示位置
  duration?: number;  // 顯示時間（毫秒）
  showArrow?: boolean;  // 是否顯示箭頭
  showBorder?: boolean;  // 是否顯示紅色邊框
}

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  private overlayRef: OverlayRef | null = null;
  private hideTimeout: any = null;
  private errorHighlightedElement: HTMLElement | null = null;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  /**
   * 顯示一個Tooltip
   * @param message 提示訊息
   * @param targetElement 目標元素
   * @param position 位置
   * @param autoHideTime 自動隱藏時間（毫秒）
   * @param showArrow 是否顯示箭頭
   */
  show(
    message: string,
    targetElement: HTMLElement,
    position: TooltipPosition = 'top',
    autoHideTime: number = 3000,
    showArrow: boolean = true
  ): void {
    this.hide(); // 先隱藏已存在的tooltip

    // 設置位置策略
    const positionStrategy = this.getPositionStrategy(targetElement, position);

    // 創建overlay配置
    const config: OverlayConfig = {
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false
    };

    // 創建overlay
    this.overlayRef = this.overlay.create(config);

    // 創建內容
    const tooltipPortal = new ComponentPortal(TooltipContentComponent);
    const tooltipRef = this.overlayRef.attach(tooltipPortal);

    // 設置內容屬性
    tooltipRef.instance.message = message;
    tooltipRef.instance.position = position;
    tooltipRef.instance.showArrow = showArrow;

    // 設置自動隱藏
    if (autoHideTime > 0) {
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, autoHideTime);
    }
  }

  /**
   * 隱藏當前顯示的Tooltip
   */
  hide(): void {
    // 清除之前的錯誤樣式
    if (this.errorHighlightedElement) {
      this.errorHighlightedElement.style.border = '';
      this.errorHighlightedElement.style.boxShadow = '';
      this.errorHighlightedElement = null;
    }

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * 顯示表單驗證錯誤的Tooltip，支持自定義選項
   * @param message 錯誤訊息
   * @param element 目標元素
   * @param options 自定義選項
   */
  showError(
    message: string,
    element: HTMLElement,
    options: ErrorTooltipOptions = {}
  ): void {
    // 設置默認選項
    const defaultOptions: ErrorTooltipOptions = {
      position: 'top',
      duration: 5000,
      showArrow: true,
      showBorder: true
    };

    // 合併選項
    const finalOptions = { ...defaultOptions, ...options };

    // 將錯誤訊息顯示在元素指定位置
    this.show(
      message,
      element,
      finalOptions.position!,
      finalOptions.duration!,
      finalOptions.showArrow!
    );

    // 為目標元素添加錯誤樣式
    if (finalOptions.showBorder) {
      element.style.border = '1px solid #ff4d4f';
      element.style.boxShadow = '0 0 0 2px rgba(255, 77, 79, 0.2)';
      // 記錄當前添加了錯誤樣式的元素
      this.errorHighlightedElement = element;
    }
  }

  /**
   * 獲取位置策略
   */
  private getPositionStrategy(targetElement: HTMLElement, preferredPosition: TooltipPosition): FlexibleConnectedPositionStrategy {
    // 定義各個位置的設置
    const positions: ConnectedPosition[] = [];

    // 根據指定位置添加主要位置
    switch (preferredPosition) {
      case 'top':
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8
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
        break;
      case 'bottom':
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8
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
        break;
    }

    // 添加更多備用位置，以確保總是能找到一個合適的位置
    // 優先添加與首選位置不同的位置
    if (preferredPosition !== 'bottom') {
      positions.push({
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8
      });
    }

    if (preferredPosition !== 'top') {
      positions.push({
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8
      });
    }

    if (preferredPosition !== 'right') {
      positions.push({
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 8
      });
    }

    if (preferredPosition !== 'left') {
      positions.push({
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -8
      });
    }

    // 確保 overlayPositionBuilder 正確連接到目標元素
    const elementRef = new ElementRef(targetElement);

    return this.overlayPositionBuilder
      .flexibleConnectedTo(elementRef)
      .withPositions(positions)
      .withPush(true)  // 確保 tooltip 保持在視窗內
      .withGrowAfterOpen(true); // 確保 overlay 在開啟後可以調整大小
  }
}
