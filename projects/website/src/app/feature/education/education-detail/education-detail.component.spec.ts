import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationDetailComponent } from './education-detail.component';

describe('EducationDetailComponent', () => {
  let component: EducationDetailComponent;
  let fixture: ComponentFixture<EducationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
