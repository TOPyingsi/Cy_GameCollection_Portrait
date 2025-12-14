import { _decorator, Component, Node } from 'cc';
import { ZDXS_AudioManager } from './ZDXS_AudioManager';
import { ZDXS_AUDIO } from './ZDXS_Constant';
const { ccclass, property } = _decorator;

@ccclass('ZDXS_Guide')
export class ZDXS_Guide extends Component {

    @property(Node)
    Guide: Node[] = [];

    Target: Node = null;
    CurIndex: number = 0;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.Next, this);
    }

    Show() {
        this.node.active = true;
        this.Target = this.Guide[0];
        this.CurIndex = 0;
        this.Target.active = true;
    }

    Next() {
        ZDXS_AudioManager.Instance.Play(ZDXS_AUDIO.按钮点击);
        this.Target.active = false;
        if (this.CurIndex >= this.Guide.length - 1) {
            this.node.active = false;
            return;
        }
        this.CurIndex++;
        this.Target = this.Guide[this.CurIndex];
        this.Target.active = true;
    }
}


