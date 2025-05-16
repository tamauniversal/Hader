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
  private activeErrorTooltips = new Map<HTMLElement, OverlayRef>();
  private errorTimeouts = new Map<HTMLElement, any>();
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
    position: TooltipPosition = 'bottom',
    autoHideTime: number = 3000,
    showArrow: boolean = true
  ): void {
    this.hide(); // 先隱藏已存在的tooltip

    // 設置位置策略
    const positionStrategy = this.getPositionStrategy(targetElement, position);

    // 創建overlay配置
    const config: OverlayConfig = {
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: false,
      panelClass: ['tooltip-overlay'],
      width: 'auto',
      maxWidth: '300px'
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
    tooltipRef.instance.isError = false;

    // 強制觸發變更檢測
    this.appRef.tick();

    // 確保tooltip位置正確
    setTimeout(() => {
      if (this.overlayRef) {
        this.overlayRef.updatePosition();
      }
    }, 0);

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
      this.errorHighlightedElement.classList.remove('error-input');
      this.errorHighlightedElement = null;
    }

    // 隱藏所有錯誤提示
    this.hideAllErrors();

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
   * 隱藏所有錯誤提示
   */
  hideAllErrors(): void {
    // 清除所有活動錯誤提示
    this.activeErrorTooltips.forEach((overlayRef) => {
      overlayRef.dispose();
    });
    this.activeErrorTooltips.clear();

    // 清除所有超時
    this.errorTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.errorTimeouts.clear();
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
    // 確保有效的錯誤消息
    if (!message || message.trim() === '') {
      console.warn('嘗試顯示空錯誤消息');
      return;
    }

    // 設置默認選項
    const defaultOptions: ErrorTooltipOptions = {
      position: 'bottom', // 預設在下方顯示
      duration: 5000,
      showArrow: true,
      showBorder: true
    };

    // 合併選項
    const finalOptions = { ...defaultOptions, ...options };

    // 先清除此元素之前的提示（如果有）
    this.clearErrorTooltip(element);

    // 設置位置策略
    const positionStrategy = this.getPositionStrategy(element, finalOptions.position!);

    // 創建overlay配置
    const config: OverlayConfig = {
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: false,
      panelClass: ['tooltip-overlay', 'tooltip-error-overlay'],
      width: 'auto',
      maxWidth: '300px'
    };

    // 創建overlay
    const overlayRef = this.overlay.create(config);

    // 儲存此元素的overlayRef，以便稍後可以清除
    this.activeErrorTooltips.set(element, overlayRef);

    // 創建內容
    const tooltipPortal = new ComponentPortal(TooltipContentComponent);
    const tooltipRef = overlayRef.attach(tooltipPortal);

    // 即時設置內容屬性
    tooltipRef.instance.message = message;
    tooltipRef.instance.position = finalOptions.position!;
    tooltipRef.instance.showArrow = finalOptions.showArrow!;
    tooltipRef.instance.isError = true;

    // 強制觸發變更檢測
    this.appRef.tick();

    // 確保tooltip位置正確
    setTimeout(() => {
      overlayRef.updatePosition();
    }, 10); // 增加延遲確保DOM已更新

    // 為目標元素添加錯誤樣式
    if (finalOptions.showBorder) {
      element.classList.add('error-input');
    }

    // 設置自動隱藏
    if (finalOptions.duration && finalOptions.duration > 0) {
      const timeout = setTimeout(() => {
        this.clearErrorTooltip(element);
      }, finalOptions.duration);

      // 儲存此元素的timeout，以便稍後可以清除
      this.errorTimeouts.set(element, timeout);
    }
  }

  /**
   * 清除特定元素的錯誤提示
   */
  private clearErrorTooltip(element: HTMLElement): void {
    // 清除錯誤樣式
    element.classList.remove('error-input');

    // 清除提示
    const overlayRef = this.activeErrorTooltips.get(element);
    if (overlayRef) {
      overlayRef.dispose();
      this.activeErrorTooltips.delete(element);
    }

    // 清除超時
    const timeout = this.errorTimeouts.get(element);
    if (timeout) {
      clearTimeout(timeout);
      this.errorTimeouts.delete(element);
    }
  }

  /**
   * 獲取位置策略，實現智能定位
   * 1. 預設在目標元素下方，X軸居中對齊
   * 2. 若下方空間不足，則顯示在上方
   * 3. 若左右空間不足，會自動調整偏移
   * 4. 滾動時自動關閉
   */
  private getPositionStrategy(targetElement: HTMLElement, preferredPosition: TooltipPosition): FlexibleConnectedPositionStrategy {
    // 創建基於目標元素的ElementRef
    const elementRef = new ElementRef(targetElement);

    // 定義可能的連接位置，按優先順序
    const positions: ConnectedPosition[] = [];

    // 根據首選位置設置主要連接位置
    switch (preferredPosition) {
      case 'bottom': // 下方優先（默認）
        positions.push(
          {
            originX: 'center',  // 目標元素水平中心
            originY: 'bottom',  // 目標元素底部
            overlayX: 'center', // tooltip水平中心
            overlayY: 'top',    // tooltip頂部
            offsetY: 0          // 不需額外偏移，確保箭頭直接連接到元素
          }
        );
        // 備用位置：上方
        positions.push(
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: 0
          }
        );
        break;

      case 'top': // 上方優先
        positions.push(
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: 0
          }
        );
        // 備用位置：下方
        positions.push(
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 0
          }
        );
        break;

      case 'right': // 右側優先
        positions.push(
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 0
          }
        );
        // 備用位置：左側
        positions.push(
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: 0
          }
        );
        break;

      case 'left': // 左側優先
        positions.push(
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: 0
          }
        );
        // 備用位置：右側
        positions.push(
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 0
          }
        );
        break;
    }

    // 添加更多備用位置以處理各種邊界情況
    // 左上
    positions.push({
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: 0
    });

    // 右上
    positions.push({
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: 0
    });

    // 左下
    positions.push({
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 0
    });

    // 右下
    positions.push({
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 0
    });

    // 使用FlexibleConnectedPositionStrategy連接到目標元素
    return this.overlayPositionBuilder
      .flexibleConnectedTo(elementRef)
      .withPositions(positions)
      .withPush(true)        // 確保tooltip在視窗內（自動推移）
      .withViewportMargin(5) // 與視窗邊界保持5px的距離
      .withFlexibleDimensions(false) // 固定尺寸，不隨內容變化
      .withGrowAfterOpen(false);     // 開啟後不再調整大小
  }
}
