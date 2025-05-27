import { Component } from '@angular/core';
import { BannerComponent } from "./components/banner/banner.component";
import { CarousellComponent } from "./components/carousell/carousell.component";
import { InfoComponent } from "./components/info/info.component";
import { TestApiComponent } from "../test-api/test-api.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, CarousellComponent, InfoComponent, TestApiComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
