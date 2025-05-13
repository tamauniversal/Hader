import { Component } from '@angular/core';
import { BannerComponent } from "./banner/banner.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { DoctorInfoComponent } from "./doctor-info/doctor-info.component";

@Component({
  selector: 'app-about',
  imports: [BannerComponent, ScheduleComponent, DoctorInfoComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
