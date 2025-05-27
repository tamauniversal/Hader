import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PatientIdentityResponse,
  ScheduleResponse,
  ReservationResponse,
  ReservationQueryResponse,
  CurrentNumberResponse
} from '../models/nhi-api.interface';

/**
 * NHI API Service
 * 串接健保署網路掛號相關API
 * 各API皆為GET，參數請參考官方文件
 */
@Injectable({
  providedIn: 'root',
})
export class NhiApiService {
  private baseUrl = 'https://nhi.techgroup.com.tw:5003';

  constructor(private http: HttpClient) {}

  /**
   * 1-1 病患身份查詢
   * @param PID 合作夥伴ID
   * @param CCode 院所代號
   * @param ID 患者身份證(最多10碼)
   */
  getPatientIdentity(PID: string, CCode: string, ID: string): Observable<PatientIdentityResponse> {
    const params = new HttpParams()
      .set('PID', PID)
      .set('CCode', CCode)
      .set('ID', ID);
    return this.http.get<PatientIdentityResponse>(`${this.baseUrl}/網路掛號/病患身份查詢`, { params });
  }

  /**
   * 1-2 排班表查詢
   * @param PID 合作夥伴ID
   * @param CCode 院所代號
   * @param sDate 查詢起日(格式: yyyyMMdd)
   * @param eDate 查詢迄日(格式: yyyyMMdd)
   */
  getSchedule(PID: string, CCode: string, sDate: string, eDate: string): Observable<ScheduleResponse> {
    const params = new HttpParams()
      .set('PID', PID)
      .set('CCode', CCode)
      .set('sDate', sDate)
      .set('eDate', eDate);
    return this.http.get<ScheduleResponse>(`${this.baseUrl}/網路掛號/排班表查詢`, { params });
  }

  /**
   * 1-3 預約掛號
   * @param PID 合作夥伴ID
   * @param CCode 院所代號
   * @param ID 病患身份證
   * @param BDate 病患生日(yyyyMMdd)
   * @param Rdate 欲掛號日期(yyyyMMdd)
   * @param Sid 排班識別碼
   * @param Name 患者姓名(初診必要)
   * @param Tel 患者電話(初診必要)
   * @param From 來源(APP/自掛機/網路掛號)
   */
  reserve(PID: string, CCode: string, ID: string, BDate: string, Rdate: string, Sid: string, Name: string, Tel: string, From: string): Observable<ReservationResponse> {
    const params = new HttpParams()
      .set('PID', PID)
      .set('CCode', CCode)
      .set('ID', ID)
      .set('BDate', BDate)
      .set('Rdate', Rdate)
      .set('sid', Sid)
      .set('Name', Name)
      .set('Tel', Tel)
      .set('From', From);
    return this.http.get<ReservationResponse>(`${this.baseUrl}/網路掛號/預約掛號`, { params });
  }

  /**
   * 1-4 預約掛號查詢
   * @param PID 合作夥伴ID
   * @param CCodes 院所代號(注意: 參數名為CCodes)
   * @param ID 病患身份證
   * @param BDate 病患生日(yyyyMMdd)
   */
  getReservationQuery(PID: string, CCodes: string, ID: string, BDate: string): Observable<ReservationQueryResponse> {
    const params = new HttpParams()
      .set('PID', PID)
      .set('CCodes', CCodes)
      .set('ID', ID)
      .set('BDate', BDate);
    return this.http.get<ReservationQueryResponse>(`${this.baseUrl}/網路掛號/預約掛號查詢`, { params });
  }

  /**
   * 1-5 目前看診號查詢
   * @param PID 合作夥伴ID
   * @param CCode 院所代號
   */
  getCurrentNumber(PID: string, CCode: string): Observable<CurrentNumberResponse> {
    const params = new HttpParams()
      .set('PID', PID)
      .set('CCode', CCode);
    return this.http.get<CurrentNumberResponse>(`${this.baseUrl}/網路掛號/目前看診號查詢`, { params });
  }
}
