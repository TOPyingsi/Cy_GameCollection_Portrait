import { _decorator, AudioSource, Component, director, EventTouch, find, Node, PageView, tween, v3 } from 'cc';
import NZLLX_WenziGame from './NZLLX_WenziGame';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('NZLLX_Select')

export class NZLLX_Select extends Component {
    @property(Node) //栏目
    Btn_More: Node;
    start() {
        if (Banner.IsShowServerBundle == false) {
            this.Btn_More.active = false
        }
        else {
            this.Btn_More.active = true;
        }
        this.node.getComponent(AudioSource).play();
        for (let i = 1; i < 5; i++) {
            tween(find("Canvas/BG/选关/Page/view/content/page1/关卡" + i))
                .delay(i * 0.1)
                .to(0.5, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
                .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                .start();
        }
    }
    dotween(event: PageView) {

        if (event.curPageIdx == 1) {
            for (let i = 4; i < 9; i++) {
                tween(find("Canvas/BG/选关/Page/view/content/page2/关卡" + i))
                    .delay((i - 3) * 0.1)
                    .to(0.5, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
                    .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                    .start();
            }
        }
        if (event.curPageIdx == 2) {
            for (let i = 9; i < 11; i++) {
                tween(find("Canvas/BG/选关/Page/view/content/page3/关卡" + i))
                    .delay((i - 8) * 0.1)
                    .to(0.5, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
                    .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                    .start();
            }
        }
        if (event.curPageIdx == 3) {
            for (let i = 9; i < 11; i++) {
                tween(find("Canvas/BG/选关/Page/view/content/page4/关卡" + i))
                    .delay((i - 8) * 0.1)
                    .to(0.5, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
                    .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                    .start();
            }
        }
        if (event.curPageIdx == 4) {
            for (let i = 9; i < 11; i++) {
                tween(find("Canvas/BG/选关/Page/view/content/page5/关卡" + i))
                    .delay((i - 8) * 0.1)
                    .to(0.5, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
                    .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                    .start();
            }
        }
        if (event.curPageIdx == 5) {
            for (let i = 9; i < 11; i++) {
                tween(find("Canvas/BG/选关/Page/view/content/page6/关卡" + i))
                    .delay((i - 8) * 0.1)
                    .to(0.5, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
                    .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                    .start();
            }
        }
        if (event.curPageIdx == 0) {
            for (let i = 1; i < 5; i++) {
                tween(find("Canvas/BG/选关/Page/view/content/page1/关卡" + i))
                    .delay(i * 0.1)
                    .to(0.5, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
                    .to(0.5, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                    .start();
            }
        }

    }


    OnClick(btn: EventTouch) {

        console.log(btn.target.name);
        if (btn.target.name == "关卡1") {
            NZLLX_WenziGame.scnen = 22;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡2") {
            NZLLX_WenziGame.scnen = 1;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡3") {
            NZLLX_WenziGame.scnen = 2;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡4") {
            NZLLX_WenziGame.scnen = 3;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡5") {
            NZLLX_WenziGame.scnen = 4;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡6") {
            NZLLX_WenziGame.scnen = 5;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡7") {
            NZLLX_WenziGame.scnen = 6;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡8") {
            NZLLX_WenziGame.scnen = 7;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡9") {
            NZLLX_WenziGame.scnen = 8;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡10") {
            NZLLX_WenziGame.scnen = 9;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡11") {
            NZLLX_WenziGame.scnen = 10;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡12") {
            NZLLX_WenziGame.scnen = 11;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡13") {
            NZLLX_WenziGame.scnen = 12;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡14") {
            NZLLX_WenziGame.scnen = 13;
            director.loadScene("NZLLX_Game");
        }
        else if (btn.target.name == "关卡15") {
            NZLLX_WenziGame.scnen = 14;
            director.loadScene("NZLLX_Game");
        } else if (btn.target.name == "关卡16") {
            NZLLX_WenziGame.scnen = 15;
            director.loadScene("NZLLX_Game");
        } else if (btn.target.name == "关卡17") {
            NZLLX_WenziGame.scnen = 16;
            director.loadScene("NZLLX_Game");
        } else if (btn.target.name == "关卡18") {
            NZLLX_WenziGame.scnen = 17;
            director.loadScene("NZLLX_Game");
        } else if (btn.target.name == "关卡19") {
            NZLLX_WenziGame.scnen = 18;
            director.loadScene("NZLLX_Game");
        } else if (btn.target.name == "关卡20") {
            NZLLX_WenziGame.scnen = 19;
            director.loadScene("NZLLX_Game");
        } else if (btn.target.name == "关卡21") {
            NZLLX_WenziGame.scnen = 20;
            director.loadScene("NZLLX_Game");
        } else if (btn.target.name == "关卡22") {
            NZLLX_WenziGame.scnen = 21;
            director.loadScene("NZLLX_Game");
        }

        //2700
    }
    ReturnHome() {
        director.loadScene("Start");
    }
    onClick1() {
        UIManager.ShowPanel(Panel.MoreGamePagePanel);
    }

}


