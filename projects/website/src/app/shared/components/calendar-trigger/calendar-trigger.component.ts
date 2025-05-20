import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  Injector,
  Input,
  Output,
  EventEmitter,
  inject
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-trigger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-trigger.component.html',
  styleUrl: './calendar-trigger.component.scss',
})
export class CalendarTriggerComponent {
  @Input() selectedDate: Date | null = null;
  @Output() dateChange = new EventEmitter<Date>();

  @ViewChild('triggerBtn', { static: true }) triggerBtn!: ElementRef;

  private overlayRef: OverlayRef | null = null;

  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private injector = inject(Injector);

  openCalendar() {
    const triggerElement = this.triggerBtn.nativeElement as HTMLElement;
    const rect = triggerElement.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;

    const positions: ConnectedPosition[] = isMobile
      ? [
          {
            originX: 'center',
            originY: 'center',
            overlayX: 'center',
            overlayY: 'center',
          },
        ]
      : [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 8,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -8,
          },
        ];

    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(triggerElement)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: isMobile ? '90vw' : rect.width,
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());

    const calendarPortal = new ComponentPortal(CalendarComponent, this.vcr, this.injector);
    const calendarRef = this.overlayRef.attach(calendarPortal);
    calendarRef.instance.activeDate = new Date(this.selectedDate || Date.now());

    calendarRef.instance.dateSelected.subscribe((date: Date) => {
      this.selectedDate = date;
      this.dateChange.emit(date);
    });
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

}
