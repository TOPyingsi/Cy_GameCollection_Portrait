import { _decorator, Component, Label, Node } from 'cc';
import { SHJZWD_GameMgr } from './SHJZWD_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJZWD_Tips')
export class SHJZWD_Tips extends Component {

    private tipsArr: string[] = [
        "香蕉猴是卧底",
        "长颈鹿猩猩是卧底",
        "骆驼橘子是卧底",
        "咖啡忍者是卧底",
        "木棍人是卧底",
        "邪恶橘子是卧底",
        "木棍人是卧底",
        "武士鸟茶壶人是卧底",
        "木棍人是卧底",
        "仙人掌企鹅是卧底"

    ]
    private label: Label = null;

    protected onEnable(): void {
        if (!this.label) {
            this.label = this.node.getComponent(Label);
        }
        this.label.string = this.tipsArr[SHJZWD_GameMgr.instance.levelIndex];
    }

}


