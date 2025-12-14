import { _decorator, Component, EventTouch, Node, tween, UITransform, v2, Vec3 } from 'cc';
import { GH_GameManager } from './GH_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import UI_Shaking from 'db://assets/Scripts/Framework/UI/UI_Shaking';
const { ccclass, property } = _decorator;

@ccclass('GH_FTTouch')
export class GH_FTTouch extends Component {

    @property(Node) gameArea: Node = null;
    @property(Node) objective: Node = null;
    @property(Node) after: Node = null;
    @property([Node]) nodes: Node[] = [];
    @property([Node]) tweenObjective: Node[] = [];

    private originalPos: Vec3 = new Vec3();


    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.originalPos = this.node.position.clone();
        this.node.setPosition(touchStartPos.x, touchStartPos.y);
        AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    Itimeout

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        const size = this.objective.getComponent(UITransform).contentSize;
        const pos = this.objective.position.clone();



        //apk
        if (touchEndPos.clone().subtract(pos).length() < 150) {

            console.log("---------------------------------------------------------------------------------------")
            console.log("目标位置：", pos)
            console.log("目标范围：", v2(pos.x - size.width / 2, pos.y - size.height / 2), v2(pos.x + size.width / 2, pos.y + size.height / 2))
            console.log("触摸位置：", touchEndPos)

            AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)

            this.node.destroy();
            this.objective.active = false;
            this.after.active = true;
            this.nodes = this.nodes.filter(node => node.active);
            const shakingCompent = this.objective.getComponent(UI_Shaking);
            shakingCompent.Shaking(10, 5)

            this.scheduleOnce(() => {
                shakingCompent.Stop()
            }, 0.3)

            this.nodes.forEach(node => {
                AudioManager.Instance.PlaySFX(GH_GameManager.instance.ti)

                tween(node)
                    .to(1, { angle: 1440 })
                    .start();
                tween(node)
                    .to(1, { position: this.tweenObjective[this.nodes.indexOf(node)].position })
                    .call(() => {
                        node.active = false;
                    })
                    .start();
            });
            this.Itimeout = setTimeout(() => {
                clearTimeout(this.Itimeout);
                GH_GameManager.instance.gamePanel.Lost();
            }, 2000)
        } else {
            this.node.setPosition(this.originalPos);
        }






        // const bol = this.objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
        // if (bol && this.objective.active) {
        //     AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)

        //     this.node.destroy();
        //     this.objective.active = false;
        //     this.after.active = true;
        //     this.nodes = this.nodes.filter(node => node.active);
        //     const shakingCompent = this.objective.getComponent(UI_Shaking);
        //     shakingCompent.Shaking(10, 5)

        //     this.scheduleOnce(() => {
        //         shakingCompent.Stop()
        //     }, 0.3)

        //     this.nodes.forEach(node => {
        //         AudioManager.Instance.PlaySFX(GH_GameManager.instance.ti)

        //         tween(node)
        //             .to(1, { angle: 1440 })
        //             .start();
        //         tween(node)
        //             .to(1, { position: this.tweenObjective[this.nodes.indexOf(node)].position })
        //             .call(() => {
        //                 node.active = false;
        //             })
        //             .start();
        //     });
        //     this.Itimeout = setTimeout(() => {
        //         clearTimeout(this.Itimeout);
        //         GH_GameManager.instance.gamePanel.Lost();
        //     }, 2000)
        // } else {
        //     this.node.setPosition(this.originalPos);
        // }
    }

}


