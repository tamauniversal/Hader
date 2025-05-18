import { Component } from '@angular/core';
import { EducationCardComponent } from '../../../shared/components/education-card/education-card.component';
import { EducationCard, EducationCardType } from '../../../shared/components/education-card/education-card.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-education-detail',
  imports: [RouterModule, EducationCardComponent],
  templateUrl: './education-detail.component.html',
  styleUrl: './education-detail.component.scss',
})
export class EducationDetailComponent {
  article = {
    title: '飲食均衡教你怎麼吃',
    content: `飲食均衡:教你怎麼吃,營養師解析關鍵!
    你知道你的飲食真的均衡嗎?營養師解析關鍵,揭開常見迷思,帶你吃得更健康。哪些食物該多吃?哪些習慣要改變?一起來看看!

    什麼是均衡飲食?
    均衡飲食指的是攝取足夠且多樣的營養素,包括碳水化合物、蛋白質、脂肪、維生素和礦物質。這不只是簡單地吃蔬菜、水果和蛋白質,而是要確保每天的飲食中包含不同類別的食物,維持營養的全面性。

    常見的飲食誤區
    以為少吃就是健康
    許多人為了減重,選擇極端少吃甚至不吃主食,這可能導致營養不均,影響身體代謝。正確的方法是選擇適量的全穀類,如糙米、燕麥,提供穩定能量。

    過度依賴健康食品
    以為吃了維生素、蛋白粉或代餐就能均衡飲食?這些補充品雖有幫助,但不能取代天然食物中的完整營養。真正的健康來自於多樣化的食材,而非單靠補充品。

    不吃油脂
    許多人害怕脂肪,認為吃油會變胖,但適量健康脂肪(如堅果、橄欖油、魚類)對身體有益,能幫助吸收脂溶性維生素並維持細胞功能。

    如何打造均衡的一餐?
    主食:選擇糙米、地瓜、全麥麵包等富含膳食纖維的碳水化合物,避免精緻澱粉。
    蛋白質:搭配豆類、魚肉、雞胸肉或蛋,確保攝取足夠的優質蛋白質。
    蔬菜水果:每天至少攝取五份不同顏色的蔬果,獲取多元維生素與抗氧化物。
    健康脂肪:選擇堅果、亞麻籽、酪梨等健康油脂,維持身體機能。
    水分補充:避免含糖飲料,每天喝足夠的水,幫助身體代謝。
    結論:養成長期健康習慣
    飲食均衡不代表要嚴格控制或刻意限制,而是學會聰明選擇食材,搭配多樣營養。當我們開始注意食物的來源與組合,身體自然會感受到正向變化。現在就開始調整飲食,讓健康成為日常的一部分吧!`,
  };

  recommandEducation: EducationCard = {
    tag: '日常\n保健',
    title: '飲食均衡\n教你怎麼吃',
    type: EducationCardType.TYPE_1,
    url: '/education/detail/1',
  };
}
