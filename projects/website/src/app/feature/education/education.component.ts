import { Component } from '@angular/core';
import { EducationCardComponent } from '../../shared/components/education-card/education-card.component';
import { EducationCardType } from '../../shared/components/education-card/education-card.interface';

@Component({
  selector: 'app-education',
  imports: [EducationCardComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  educationList = [
    {
      card: {
        tag: '日常\n保健',
        title: '飲食均衡\n教你怎麼吃',
        type: EducationCardType.TYPE_1,
        url: '/education',
      },
      desc: '你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?',
    },
    {
      card: {
        tag: '醫療\n新知',
        title: '關於流感疫苗\n你知道多少?',
        type: EducationCardType.TYPE_2,
        url: '/education',
      },
      desc: '你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?',
    },
    {
      card: {
        tag: '日常\n保健',
        title: '飲食均衡\n教你怎麼吃',
        type: EducationCardType.TYPE_3,
        url: '/education',
      },
      desc: '你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?',
    },
    {
      card: {
        tag: '醫療\n新知',
        title: '關於流感疫苗\n你知道多少?',
        type: EducationCardType.TYPE_4,
        url: '/education',
      },
      desc: '你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?',
    },
    {
      card: {
        tag: '日常\n保健',
        title: '飲食均衡\n教你怎麼吃',
        type: EducationCardType.TYPE_5,
        url: '/education',
      },
      desc: '你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?',
    },
    {
      card: {
        tag: '醫療\n新知',
        title: '關於流感疫苗\n你知道多少?',
        type: EducationCardType.TYPE_1,
        url: '/education',
      },
      desc: '你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?',
    },
  ];
}
