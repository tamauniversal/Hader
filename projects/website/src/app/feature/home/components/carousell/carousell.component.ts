import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carousell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carousell.component.html',
  styleUrls: ['./carousell.component.scss']
})
export class CarousellComponent implements OnInit, OnDestroy {
  isBrowser: boolean;
  currentIndex = 1;
  isDragging = false;
  startX = 0;
  currentX = 0;
  autoPlayTimer: any;
  isTransitioning = false;
  hasTransition = true;
  readonly SWIPE_THRESHOLD = 20; // 滑動門檻值
  readonly AUTO_PLAY_INTERVAL = 5000; // 自動播放間隔
  readonly TRANSITION_DURATION = 300; // 過渡動畫時間（毫秒）
  readonly GAP_PX = 16; // slide 間隔 16px
  readonly SLIDE_PERCENT = 90; // slide 百分比寬度
  readonly SIDE_VISIBLE_PERCENT = 5; // 左右露出百分比
  readonly INITIAL_OFFSET = 5; // 初始偏移量，5% 螢幕寬度

  // 輪播圖片陣列
  banners = [
    { src: '/img/home/picture.svg', alt: 'picture 1' },
    { src: '/img/home/picture.svg', alt: 'picture 2' },
    { src: '/img/home/picture.svg', alt: 'picture 3' },
  ];

  // 用於無限輪播的擴展陣列
  extendedBanners: any[] = [];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    // 修改擴展陣列邏輯，在頭尾各添加兩張圖片
    if (this.banners.length === 1) {
      // 如果只有一張圖片，則複製5次
      this.extendedBanners = [
        ...Array(2).fill(this.banners[0]),
        this.banners[0],
        ...Array(2).fill(this.banners[0])
      ];
    } else {
      // 如果有多張圖片，在頭尾各添加兩張
      this.extendedBanners = [
        this.banners[this.banners.length - 2],
        this.banners[this.banners.length - 1],
        ...this.banners,
        this.banners[0],
        this.banners[1]
      ];
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      this.stopAutoPlay();
    }
  }

  // 開始自動播放
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      if (!this.isDragging && !this.isTransitioning) {
        this.nextSlide();
      }
    }, this.AUTO_PLAY_INTERVAL);
  }

  // 停止自動播放
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  // 切換到下一張
  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex++;
    this.checkAndResetIndex();
  }

  // 切換到上一張
  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex--;
    this.checkAndResetIndex();
  }

  // 檢查並重置索引
  private checkAndResetIndex() {
    // 如果到達最後一張（複製的第一張）
    if (this.currentIndex >= this.banners.length + 2) {
      setTimeout(() => {
        this.hasTransition = false;
        this.currentIndex = 2;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.hasTransition = true;
            this.isTransitioning = false;
          });
        });
      }, this.TRANSITION_DURATION);
    }
    // 如果到達第一張（複製的最後一張）
    else if (this.currentIndex <= 0) {
      setTimeout(() => {
        this.hasTransition = false;
        this.currentIndex = this.banners.length;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.hasTransition = true;
            this.isTransitioning = false;
          });
        });
      }, this.TRANSITION_DURATION);
    } else {
      setTimeout(() => {
        this.isTransitioning = false;
      }, this.TRANSITION_DURATION);
    }
  }

  // 切換到指定索引
  goToSlide(index: number) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex = index + 2; // 修改為+2，因為我們在頭尾各加了两張圖片
    this.checkAndResetIndex();
    this.startAutoPlay();
  }

  // 滑鼠按下事件
  onMouseDown(event: MouseEvent) {
    if (!this.isBrowser || this.isTransitioning) return;
    this.isDragging = true;
    this.startX = event.clientX;
    this.currentX = this.startX;
    this.stopAutoPlay();
  }

  // 滑鼠移動事件
  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser || !this.isDragging) return;
    this.currentX = event.clientX;
  }

  // 滑鼠放開事件
  onMouseUp() {
    if (!this.isBrowser || !this.isDragging) return;
    const diff = this.currentX - this.startX;
    if (Math.abs(diff) > this.SWIPE_THRESHOLD) {
      if (diff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
    this.isDragging = false;
    this.startAutoPlay();
  }

  // 觸控開始事件
  onTouchStart(event: TouchEvent) {
    if (!this.isBrowser || this.isTransitioning) return;
    this.isDragging = true;
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
    this.stopAutoPlay();
  }

  // 觸控移動事件
  onTouchMove(event: TouchEvent) {
    if (!this.isBrowser || !this.isDragging) return;
    this.currentX = event.touches[0].clientX;
  }

  // 觸控結束事件
  onTouchEnd() {
    if (!this.isBrowser || !this.isDragging) return;
    const diff = this.currentX - this.startX;
    if (Math.abs(diff) > this.SWIPE_THRESHOLD) {
      if (diff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
    this.isDragging = false;
    this.startAutoPlay();
  }

  // 計算當前拖動的位移
  getDragOffset(): number {
    if (!this.isBrowser || !this.isDragging) return 0;
    const diff = this.currentX - this.startX;
    return diff;
  }

  // 計算輪播容器的位移
  getCarouselTransform(): string {
    if (!this.isBrowser) return '';
    // slide 寬度 = 90vw - 32px
    const slideWidthPx = window.innerWidth * 0.9 - 32;
    const gapPx = this.GAP_PX;
    // offsetPx = currentIndex * (slideWidthPx + gapPx) - 拖曳距離 - gapPx
    const offsetPx = this.currentIndex * (slideWidthPx + gapPx) - this.getDragOffset() - gapPx;
    return `translateX(${-offsetPx}px)`;
  }

  // 獲取當前顯示的實際索引（用於指示點）
  getCurrentDisplayIndex(): number {
    return (this.currentIndex - 2 + this.banners.length) % this.banners.length;
  }
}
