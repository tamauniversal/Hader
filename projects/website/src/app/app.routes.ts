import { Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { AboutComponent } from './feature/about/about.component';
import { RegistrationInquiryComponent } from './feature/registration-inquiry/registration-inquiry.component';
import { FeesComponent } from './feature/fees/fees.component';
import { ProgressComponent } from './feature/progress/progress.component';
import { EducationComponent } from './feature/education/education.component';
import { NewsComponent } from './feature/news/news.component';
import { ContactComponent } from './feature/contact/contact.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'registration-inquiry', component: RegistrationInquiryComponent },
  { path: 'fees', component: FeesComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'education', component: EducationComponent },
  { path: 'news', component: NewsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'home' },
];
