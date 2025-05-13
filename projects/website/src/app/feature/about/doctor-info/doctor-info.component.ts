import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-info',
  imports: [RouterModule],
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.scss',
})
export class DoctorInfoComponent {
  doctorList = [
    {
      name: '莊惠蓉',
      department: '家醫科',
      specialties: [
        '家庭醫學',
        '健康檢查',
        '慢性病治療',
        '安寧療護諮詢',
        '戒菸治療',
      ],
      experience: ['聖母醫院 家醫科主治醫師', '國防醫學院醫學系助理教師'],
      imgUrl: '/img/about/doctor-1.svg',
    },
    {
      name: '陳曉蓮',
      department: '新陳代謝科',
      specialties: [
        '糖尿病治療',
        '高血脂、痛風',
        '代謝症候群',
        '內分泌疾病、各種內分泌機能異常',
      ],
      experience: ['博愛醫院 新陳代謝科主任'],
      imgUrl: '/img/about/doctor-2.svg',
    },
    {
      name: '江孟修',
      department: '心臟血管內科',
      specialties: [
        '高血壓、高血脂',
        '心臟血管疾病',
        '心絞痛、心衰竭、心律不整',
        '心臟瓣膜疾病',
        '心臟超音波檢查',
      ],
      experience: [
        '博愛醫院 心臟血管內科主治醫師',
        '羅東聖母醫院心臟內科主任',
        '台中榮民總醫院心臟內科主治醫師',
      ],
      imgUrl: '/img/about/doctor-1.svg',
    },
    {
      name: '馮祥華',
      department: '腎臟科',
      specialties: [
        '腎臟病治療',
        '蛋白尿、血尿治療',
        '慢性腎臟病 CKD 的治療保養',
        '急性腎臟病診治與全身健康保健計畫',
        '內科疾病治療',
      ],
      experience: [
        '國泰綜合醫院腎臟內科主治醫師 ( 主任級醫師 )',
        '三軍總醫院腎臟功能室主任',
        '三軍總醫院腎臟科主治醫師',
      ],
      imgUrl: '/img/about/doctor-2.svg',
    },
    {
      name: '莊惠蓉',
      department: '兒科',
      specialties: [
        '家庭醫學',
        '健康檢查',
        '慢性病治療',
        '安寧療護諮詢',
        '戒菸治療',
      ],
      experience: ['聖母醫院 家醫科主治醫師', '國防醫學院醫學系助理教師'],
      imgUrl: '/img/about/doctor-1.svg',
    },
  ];
}
