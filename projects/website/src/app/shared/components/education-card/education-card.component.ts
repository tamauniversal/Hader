import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EducationCard, EducationCardType } from './education-card.interface';

@Component({
  selector: 'app-education-card',
  imports: [RouterModule],
  templateUrl: './education-card.component.html',
  styleUrl: './education-card.component.scss'
})
export class EducationCardComponent {
  @Input() item: EducationCard = {
    tag: '',
    title: '',
    type: EducationCardType.TYPE_1,
    url: ''
  };
}
