import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./feature/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./feature/schedule/schedule.component').then((m) => m.ScheduleComponent),
  },
  {
    path: 'registration-inquiry',
    loadComponent: () =>
      import('./feature/registration-inquiry/registration-inquiry.component').then((m) => m.RegistrationInquiryComponent),
  },
  {
    path: 'fees',
    loadComponent: () =>
      import('./feature/fees/fees.component').then((m) => m.FeesComponent),
  },
  {
    path: 'progress',
    loadComponent: () =>
      import('./feature/progress/progress.component').then((m) => m.ProgressComponent),
  },
  {
    path: 'education',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feature/education/education.component').then((m) => m.EducationComponent),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./feature/education/education-detail/education-detail.component').then((m) => m.EducationDetailComponent),
      }
    ]
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./feature/news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'news/:id',
    loadComponent: () =>
      import('./feature/news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./feature/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
