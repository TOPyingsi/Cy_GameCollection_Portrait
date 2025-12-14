import { _decorator, Component, Label, Node } from 'cc';
import { SHJGT_GameMgr } from './SHJGT_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJGT_Answer')
export class SHJGT_Answer extends Component {
    private label: Label = null;

    private answerStrArr: string[] = [
        "把芭蕾裙移到人物身上\n把桌子上的杯子放到咖啡机\n把咖啡杯移到人物头上\n把化妆包移到茶杯头上",
        "把冰箱移到人物身上\n单击打开窗户\n把太阳移到人物头上\n把放大镜移到人物鞋子上",
        "把时钟移到人物头上\n把香蕉移到人物身上\n点击浴室门打开\n把喷头移到人物头上",
        "把饲料给蝌蚪\n把青蛙移到人物头上\n把玩具赛车移到人物身上\n单击打开柜子最右边的门\n用剪刀把人物裤子剪掉"
    ]

    start() {
    }

    protected onEnable(): void {
        if (!this.label) {
            this.label = this.getComponent(Label);
        }

        let level = SHJGT_GameMgr.instance.level;

        this.label.string = this.answerStrArr[level];
    }
}


