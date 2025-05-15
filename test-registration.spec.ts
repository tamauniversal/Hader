import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { RegistrationInquiryComponent } from './projects/website/src/app/feature/registration-inquiry/registration-inquiry.component';
import { DropdownComponent } from './projects/website/src/app/shared/components/dropdown/dropdown.component';
import { TooltipService } from './projects/website/src/app/shared/components/tooltip/tooltip.service';

describe('註冊查詢元件', () => {
  let component: RegistrationInquiryComponent;
  let fixture: ComponentFixture<RegistrationInquiryComponent>;
  let tooltipService: jasmine.SpyObj<TooltipService>;

  beforeEach(async () => {
    const tooltipServiceSpy = jasmine.createSpyObj('TooltipService', ['showError', 'show']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        OverlayModule,
        RegistrationInquiryComponent,
        DropdownComponent
      ],
      providers: [
        { provide: TooltipService, useValue: tooltipServiceSpy }
      ]
    }).compileComponents();

    tooltipService = TestBed.inject(TooltipService) as jasmine.SpyObj<TooltipService>;
    fixture = TestBed.createComponent(RegistrationInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('應該創建元件', () => {
    expect(component).toBeTruthy();
  });

  it('初始狀態下，註冊表單應該是無效的', () => {
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('填寫完所有必填欄位後，註冊表單應該是有效的', () => {
    const registrationForm = component.registrationForm;
    registrationForm.controls.name.setValue('測試用戶');
    registrationForm.controls.birthday.setValue('1990-01-01');
    registrationForm.controls.phone.setValue('0912345678');
    registrationForm.controls.idNumber.setValue('A123456789');
    registrationForm.controls.doctor.setValue('internal-wang');
    registrationForm.controls.appointmentTime.setValue('2023-06-01-morning');

    expect(registrationForm.valid).toBeTruthy();
  });

  it('提交表單時，如果表單無效應該顯示錯誤提示', () => {
    component.onRegistrationSubmit();

    // 檢查 TooltipService 的 showError 方法是否被調用
    expect(tooltipService.showError).toHaveBeenCalled();
  });

  it('切換標籤時應該更新當前激活的標籤', () => {
    component.setActiveTab('inquiry');
    expect(component.activeTab).toBe('inquiry');

    component.setActiveTab('registration');
    expect(component.activeTab).toBe('registration');
  });

  it('下拉選單選擇變更時應該更新表單值', () => {
    const doctorOption = component.doctorOptions[0];
    component.onDoctorSelected(doctorOption);

    expect(component.selectedDoctor).toBe(doctorOption);
    expect(component.registrationForm.controls.doctor.value).toBe(doctorOption.value);

    const timeOption = component.appointmentTimeOptions[0];
    component.onTimeSelected(timeOption);

    expect(component.selectedTime).toBe(timeOption);
    expect(component.registrationForm.controls.appointmentTime.value).toBe(timeOption.value);
  });
});
