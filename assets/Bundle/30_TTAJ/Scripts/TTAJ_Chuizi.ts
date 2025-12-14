import { _decorator, Component, find, Node, Vec3 } from 'cc';
import { TTAJ_GameManager } from './TTAJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TTAJ_Chuizi')
export class TTAJ_Chuizi extends Component {

   Addhezi() {
      find("Canvas/背景/敖丙/右武器").destroy();
      find("Canvas/背景/敖丙/左武器").setScale(0.5, 0.5, 0.5)

      find("Canvas/背景/桌子").addChild(find("Canvas/背景/敖丙/左武器"));
      find("Canvas/背景/桌子/左武器").setWorldPosition(find("Canvas/背景/盒子遮罩").worldPosition)

      find("Canvas/放大镜/放大镜/底层敖丙/武器").destroy();
      TTAJ_GameManager.Instance.Level1 += 1;
      TTAJ_GameManager.Instance.jingdu.string = TTAJ_GameManager.Instance.renwu[1].name + "  线索：" + TTAJ_GameManager.Instance.Level1 + "/3" + "当前人物：" + TTAJ_GameManager.Instance.Level3 + "/4";
   }
   OnClick() {
      if (TTAJ_GameManager.Instance.Level1 <= 3 && TTAJ_GameManager.Instance.Level3 == 1) {
         if (TTAJ_GameManager.Instance.Level1 == 3) {
            TTAJ_GameManager.Instance.Level2 += 1;

         }

         find("Canvas/背景/放行按钮").active = false;
         TTAJ_GameManager.Instance.Level3 += 1;
         TTAJ_GameManager.Instance.Renwu2PosBk();
         TTAJ_GameManager.Instance.Level1 = 0;
         console.error(TTAJ_GameManager.Instance.Level2);
      } else if (TTAJ_GameManager.Instance.Level1 <= 4 && TTAJ_GameManager.Instance.Level3 == 2) {
         if (TTAJ_GameManager.Instance.Level1 == 4) {
            TTAJ_GameManager.Instance.Level2 += 1;

         }
         find("Canvas/背景/放行按钮").active = false;
         TTAJ_GameManager.Instance.Level3 += 1;
         TTAJ_GameManager.Instance.Renwu3PosBk();
         TTAJ_GameManager.Instance.Level1 = 0;
         console.error(TTAJ_GameManager.Instance.Level2);
      } else if (TTAJ_GameManager.Instance.Level1 <= 4 && TTAJ_GameManager.Instance.Level3 == 3) {
         if (TTAJ_GameManager.Instance.Level1 == 4) {
            TTAJ_GameManager.Instance.Level2 += 1;

         }
         find("Canvas/背景/放行按钮").active = false;
         TTAJ_GameManager.Instance.Level3 += 1;
         TTAJ_GameManager.Instance.Renwu4PosBk();
         TTAJ_GameManager.Instance.Level1 = 0;
         console.error(TTAJ_GameManager.Instance.Level2);

      } else if (TTAJ_GameManager.Instance.Level3 == 4) {
         TTAJ_GameManager.Instance.winorlose();
      }

   }
   Addhezi1() {
      find("Canvas/背景/哪吒/曲奇").destroy();


      find("Canvas/背景/桌子").addChild(find("Canvas/背景/哪吒/曲奇1"));
      find("Canvas/背景/桌子/曲奇1").setWorldPosition(find("Canvas/背景/盒子遮罩").worldPosition)
      TTAJ_GameManager.Instance.Level1 += 1;
      TTAJ_GameManager.Instance.jingdu.string = TTAJ_GameManager.Instance.renwu[3].name + "  线索：" + TTAJ_GameManager.Instance.Level1 + "/4" + "当前人物：" + TTAJ_GameManager.Instance.Level2 + "/4";
   }
}

