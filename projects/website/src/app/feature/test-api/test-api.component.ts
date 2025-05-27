import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NhiApiService } from '../../core/services/api.service';
import {
  PatientIdentityResponse,
  ScheduleResponse,
  ReservationResponse,
  ReservationQueryResponse,
  CurrentNumberResponse
} from '../../core/models/nhi-api.interface';
import { catchError, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-test-api',
  imports: [CommonModule],
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.scss']
})
export class TestApiComponent implements OnInit {
  // 測試用參數
  PID = 'PartnerTest';
  CCode = '3543091231';
  ID = 'X88816017A';
  BDate = '20200410';
  sDate = '20200924';
  eDate = '20200924';
  Rdate = '20200928';
  Sid = '1516';
  Name = 'TESt';
  Tel = '0TEST';
  From = '網路掛號';

  // API 回傳資料
  patientIdentity?: PatientIdentityResponse;
  schedule?: ScheduleResponse;
  reservation?: ReservationResponse;
  reservationQuery?: ReservationQueryResponse;
  currentNumber?: CurrentNumberResponse;

  loading = false;
  error = '';

  constructor(private api: NhiApiService) {}

  ngOnInit(): void {
    this.callAllApis();
  }

  callAllApis() {
    this.loading = true;
    this.error = '';

    this.api.getPatientIdentity(this.PID, this.CCode, this.ID).pipe(
      tap(res1 => this.patientIdentity = res1),
      switchMap(() => this.api.getSchedule(this.PID, this.CCode, this.sDate, this.eDate)),
      tap(res2 => this.schedule = res2),
      switchMap(() => this.api.reserve(this.PID, this.CCode, this.ID, this.BDate, this.Rdate, this.Sid, this.Name, this.Tel, this.From)),
      tap(res3 => this.reservation = res3),
      switchMap(() => this.api.getReservationQuery(this.PID, this.CCode, this.ID, this.BDate)),
      tap(res4 => this.reservationQuery = res4),
      switchMap(() => this.api.getCurrentNumber(this.PID, this.CCode)),
      tap(res5 => this.currentNumber = res5),
      catchError(err => {
        this.loading = false;
        this.error = this.mapError(err); // 可自定義錯誤訊息
        return of(null); // 回傳空 observable 以避免程式終止
      })
    ).subscribe(() => {
      this.loading = false;
    });
  }

  mapError(err: any): string {
    if (err?.message?.includes('getPatientIdentity')) return '病患身份查詢失敗';
    if (err?.message?.includes('getSchedule')) return '排班表查詢失敗';
    if (err?.message?.includes('reserve')) return '預約掛號失敗';
    if (err?.message?.includes('getReservationQuery')) return '預約掛號查詢失敗';
    if (err?.message?.includes('getCurrentNumber')) return '目前看診號查詢失敗';
    return '資料取得失敗';
  }

}
