import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationInquiryComponent } from './registration-inquiry.component';

describe('RegistrationInquiryComponent', () => {
  let component: RegistrationInquiryComponent;
  let fixture: ComponentFixture<RegistrationInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationInquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
