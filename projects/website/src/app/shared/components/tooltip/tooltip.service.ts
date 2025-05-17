import {
  Injectable,
  ApplicationRef,
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
export interface TooltipOptions {
  position?: TooltipPosition;  // 提示位置
  duration?: number;  // 顯示時間（毫秒）
  showArrow?: boolean;  // 是否顯示箭頭
}

interface TooltipData {
  overlayRef: OverlayRef;
  timeout?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  // 存儲每個元素對應的tooltip數據
  private tooltips = new Map<HTMLElement, TooltipData>();
  private hideTimeout: any = null;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private appRef: ApplicationRef
  ) {}

  /**
   * 隱藏指定元素的Tooltip
   * @param element 目標元素，如果不提供則隱藏當前最後一個Tooltip
   */
  hide(element?: HTMLElement): void {
    if (element && this.tooltips.has(element)) {
      // 隱藏指定元素的tooltip
      const tooltipData = this.tooltips.get(element)!;

      // 清除計時器
      if (tooltipData.timeout) {
        clearTimeout(tooltipData.timeout);
      }

      // 銷毀overlay
      tooltipData.overlayRef.dispose();

      // 從映射中移除
      this.tooltips.delete(element);
    } else if (!element && this.tooltips.size > 0) {
      // 如果未指定元素且有活動的tooltip，隱藏最後一個
      const lastElement = Array.from(this.tooltips.keys()).pop();
      if (lastElement) {
        this.hide(lastElement);
      }
    }

    // 清除全局hideTimeout（如果有）
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * 隱藏所有Tooltip
   */
  hideAll(): void {
    // 遍歷所有tooltip並隱藏
    this.tooltips.forEach((tooltipData, element) => {
      if (tooltipData.timeout) {
        clearTimeout(tooltipData.timeout);
      }
      tooltipData.overlayRef.dispose();
    });

    // 清空映射
    this.tooltips.clear();

    // 清除全局hideTimeout（如果有）
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * 顯示表Tooltip，支持自定義選項
   * @param message 錯誤訊息
   * @param element 目標元素
   * @param options 自定義選項
   */
  show(
    message: string,
    element: HTMLElement,
    options: TooltipOptions = {}
  ): void {
    // 確保有效的錯誤消息
    if (!message || message.trim() === '') {
      console.warn('嘗試顯示空錯誤消息');
      return;
    }

    // 設置默認選項
    const defaultOptions: TooltipOptions = {
      position: 'bottom', // 預設在下方顯示
      duration: 5000,
      showArrow: true,
    };

    // 合併選項
    const finalOptions = { ...defaultOptions, ...options };

    // 先清除此元素之前的提示（如果有）
    this.hide(element);

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

    // 創建內容
    const tooltipPortal = new ComponentPortal(TooltipContentComponent);
    const tooltipRef = overlayRef.attach(tooltipPortal);

    // 即時設置內容屬性
    tooltipRef.instance.message = message;
    tooltipRef.instance.position = finalOptions.position!;
    tooltipRef.instance.showArrow = finalOptions.showArrow!;
    tooltipRef.instance.isError = true;

    // 創建TooltipData對象
    const tooltipData: TooltipData = {
      overlayRef: overlayRef
    };

    // 將tooltip數據存儲到映射中
    this.tooltips.set(element, tooltipData);

    // 強制觸發變更檢測
    this.appRef.tick();

    // 確保tooltip位置正確
    setTimeout(() => {
      if (this.tooltips.has(element)) {
        this.tooltips.get(element)!.overlayRef.updatePosition();
      }
    }, 10); // 增加延遲確保DOM已更新

    // 設置自動隱藏
    if (finalOptions.duration && finalOptions.duration > 0) {
      const timeout = setTimeout(() => {
        this.hide(element);
      }, finalOptions.duration);

      // 將timeout存儲到tooltipData中
      if (this.tooltips.has(element)) {
        this.tooltips.get(element)!.timeout = timeout;
      }
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
