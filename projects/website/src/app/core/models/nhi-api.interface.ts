/**
 * API 回應共用資訊
 * - success: 是否成功
 * - message: 回應訊息
 * - id: 請求唯一識別碼
 * - code: 狀態碼
 * - additional: 其他附加資訊
 * - exception: 例外錯誤訊息
 * - innerResults: 保留欄位
 */
export interface ApiResponseInfo {
  success: boolean;
  message: string;
  id: string;
  code: string;
  additional: any;
  exception: string | null;
  innerResults: any;
}

/**
 * 1-1 病患身份查詢回應
 * info: 回應共用資訊
 * patientList: 病患身份清單
 */
export interface PatientIdentityResponse {
  info: ApiResponseInfo;
  patientList: PatientIdentity[];
}

/**
 * 病患身份清單資料
 * - hospitalCode: 院所代號
 * - chartNo: 病歷號碼(可能重複)
 * - patientSystemId: 病患系統唯一識別值
 * - idNumber: 病患身份證字號
 * - name: 病患姓名
 * - birthDate: 病患生日(yyyymmdd)
 * - phone: 病患電話
 */
export interface PatientIdentity {
  hospitalCode: string;
  chartNo: string;
  patientSystemId: string;
  idNumber: string;
  name: string;
  birthDate: string;
  phone: string;
}

/**
 * 1-2 排班表查詢回應
 * info: 回應共用資訊
 * scheduleList: 排班資訊清單
 */
export interface ScheduleResponse {
  info: ApiResponseInfo;
  scheduleList: ScheduleInfo[];
}

/**
 * 排班資訊
 * - hospitalCode: 院所代號
 * - date: 看診日期(yyyymmdd)
 * - department: 科別名稱
 * - clinic: 診別名稱
 * - clinicCode: 診別代碼
 * - floorCode: 樓層代碼
 * - sessionCode: 班別代碼
 * - session: 班別(早/午/晚)
 * - doctorName: 醫師姓名
 * - limit: 限號數
 * - substituteDoctorName: 代班醫師姓名
 * - scheduleId: 排班識別碼
 * - visitRefNo: 可掛號否=Y時為序號，N時為原因
 * - registeredCount: 已掛號人數
 * - note: 備註
 * - doctorCode: 醫師代號
 * - substituteDoctorCode: 代班醫師代號
 * - canRegister: 是否可掛號(Y/N)
 */
export interface ScheduleInfo {
  hospitalCode: string;
  date: string;
  department: string;
  clinic: string;
  clinicCode: string;
  floorCode: string;
  sessionCode: string;
  session: string;
  doctorName: string;
  limit: number;
  substituteDoctorName: string;
  scheduleId: string;
  visitRefNo: string;
  registeredCount: string;
  note: string;
  doctorCode: string;
  substituteDoctorCode: string;
  canRegister: string;
}

/**
 * 1-3 預約掛號回應
 * info: 回應共用資訊
 * reservationId: 預掛識別碼
 * registerNo: 掛號序號
 * hospitalCode: 院所代號
 * idNumber: 病患身份證
 * birthDate: 病患生日
 * visitType: 就醫類別
 * registerDate: 掛號日期
 * department: 科別
 * clinic: 診別
 * session: 班別
 * doctor: 醫師
 * scheduleId: 排班識別碼
 */
export interface ReservationResponse {
  info: ApiResponseInfo;
  reservationId: string;
  registerNo: string;
  hospitalCode: string;
  idNumber: string;
  birthDate: string;
  visitType: string;
  registerDate: string;
  department: string;
  clinic: string;
  session: string;
  doctor: string;
  scheduleId: string;
}

/**
 * 1-4 預約掛號查詢回應
 * info: 回應共用資訊
 * reservationList: 預約掛號資訊清單
 */
export interface ReservationQueryResponse {
  info: ApiResponseInfo;
  reservationList: ReservationInfo[];
}

/**
 * 預約掛號資訊
 * - hospitalCode: 院所代號
 * - date: 預約日期
 * - department: 科別
 * - clinic: 診別
 * - session: 班別
 * - visitType: 就醫類別
 * - doctorName: 醫師姓名
 * - registerNo: 掛號序號
 * - reservationId: 預掛識別碼
 * - registerSource: 掛號來源
 * - status: 目前狀態
 * - canCancel: 是否可退掛(Y/N)
 * - cannotCancelReason: 不可退掛原因
 * - isCurrentSession: 是否為當班(Y/N)
 */
export interface ReservationInfo {
  hospitalCode: string;
  date: string;
  department: string;
  clinic: string;
  session: string;
  visitType: string | null;
  doctorName: string;
  registerNo: string;
  reservationId: string;
  registerSource: string;
  status: string;
  canCancel: string;
  cannotCancelReason: string;
  isCurrentSession: string;
}

/**
 * 1-5 目前看診號查詢回應
 * info: 回應共用資訊
 * currentNumberList: 目前看診號清單
 */
export interface CurrentNumberResponse {
  info: ApiResponseInfo;
  currentNumberList: CurrentNumberInfo[];
}

/**
 * 目前看診號資訊
 * - hospitalCode: 院所代號
 * - date: 看診日期
 * - department: 科別
 * - clinic: 診別
 * - session: 班別
 * - doctorName: 醫師姓名
 * - currentNumber: 目前看診號
 * - waitingCount: 等待人數
 */
export interface CurrentNumberInfo {
  hospitalCode: string;
  date: string;
  department: string;
  clinic: string;
  session: string;
  doctorName: string;
  currentNumber: string;
  waitingCount: string;
}
