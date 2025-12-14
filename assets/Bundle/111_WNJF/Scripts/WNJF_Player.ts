import { _decorator, AnimationComponent, Component, Node } from 'cc';
import { WNJF_GameMgr } from './WNJF_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('WNJF_Player')
export class WNJF_Player extends Component {

    commonNode: Node = null;
    start() {
        this.commonNode = this.node.getChildByName("普通");
    }

    playAni(aniName: string) {
        this.commonNode.active = false;

        this.node.getChildByName(aniName).active = true;

        WNJF_GameMgr.instance.ani.once(AnimationComponent.EventType.FINISHED, () => {
            this.scheduleOnce(() => {
                if (WNJF_GameMgr.instance.isGameOver) {
                    // WNJF_GameMgr.instance.ani.play(aniName);
                    WNJF_GameMgr.instance.Win();
                    return;
                }
                this.node.getChildByName(aniName).active = false;
                this.commonNode.active = true;
            }, 0.2);
        }, this);

        WNJF_GameMgr.instance.ani.play(aniName);
    }

    startGame() {
        this.commonNode.active = true;
        this.node.getChildByName("开始").destroy();
    }

    Lost() {
        this.commonNode.active = false;

        this.node.getChildByName("失败").active = true;

    }
}


