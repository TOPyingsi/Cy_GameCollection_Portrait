import { _decorator, Component, Label, Node } from 'cc';
import { eventCenter } from '../../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../../Utils/JJWXR_Events';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_Tutorial')
export class JJWXR_Tutorial extends Component {

    @property(Node)
    private hightlight: Node = null;

    @property(Node)
    private conversationBox: Node = null;

    @property(Label)
    private teachingLabel: Label = null;

    private isStarted: boolean = true;


    start() {
        eventCenter.on(JJWXR_Events.GUN_FIRED, this.classIsOver, this);

        this.isStarted = true;
        this.node.getChildByName('Bg').active = true;
        this.hightlight.active = false;
        this.conversationBox.active = false;

        if (this.isStarted) {
            this.conversationBox.active = true;
            this.teachingLabel.string = "欢迎来到游戏";
            this.scheduleOnce(() => {
                this.teachingLabel.string = "请滑动屏幕开始游戏";
            }, 1);
            this.node.active = false; //隐藏教程

            this.scheduleOnce(() => {
                this.teachingLabel.string = "当你发现一个隐藏的小人时, 请点击瞄准";
            }, 1);
            this.hightlight.active = true; //显示高亮
            this.node.getChildByName('Bg').active = false;
        }
    }

    onDisable() {
        eventCenter.off(JJWXR_Events.GUN_FIRED, this.classIsOver, this);
    }

    classIsOver() {
        this.teachingLabel.string = "恭喜完成教学！";
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 1);
    }
}