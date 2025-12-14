import { _decorator, Component, EventTouch, Label, Node, sp, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import UI_Shaking from 'db://assets/Scripts/Framework/UI/UI_Shaking';
import { GH_GameManager } from './GH_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GH_SRTouch')
export class GH_SRTouch extends Component {
    @property(Node) gameArea: Node = null;
    @property([Node]) objectives: Node[] = [];
    private originalPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.originalPos = this.node.getPosition().clone();
        this.node.setPosition(touchStartPos.x, touchStartPos.y);
        AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.objectives = this.objectives.filter(objective => objective.active);
        this.objectives.forEach(objective => {

            const size = objective.getComponent(UITransform).contentSize;
            const pos = objective.position.clone();

            //apk
            if ((touchEndPos.x >= pos.x - size.width / 2 && touchEndPos.x <= pos.x + size.width / 2) && (touchEndPos.y >= pos.y - size.height / 2 && touchEndPos.y <= pos.y + size.height / 2)) {

                console.log("---------------------------------------------------------------------------------------")
                console.log("目标位置：", pos)
                console.log("目标范围：", v2(pos.x - size.width / 2, pos.y - size.height / 2), v2(pos.x + size.width / 2, pos.y + size.height / 2))
                console.log("触摸位置：", touchEndPos)

                AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)

                GH_GameManager.instance.mask.active = true
                const _pos = objective.getPosition()
                this.node.setPosition(_pos.x + 100, _pos.y + 200)
                const shakingCompent = this.node.getComponent(UI_Shaking);
                shakingCompent.Shaking(10, 5)
                AudioManager.Instance.PlaySFX(GH_GameManager.instance.ti)

                this.scheduleOnce(() => {
                    shakingCompent.Stop()

                    objective.setPosition(0, 120)
                    const uio = this.node.getComponent(UIOpacity)
                    tween(uio).to(0.5, { opacity: 0 }).start()
                    tween(objective)
                        .by(1, { angle: 720 })
                        .start()
                    tween(objective)
                        .to(1, { position: v3(-350, -400) })
                        .call(() => {
                            const lb = objective.getChildByName("Label");
                            lb.active = true;
                            lb.getChildByName("String").getComponent(Label).string = "虽然过来了，但是屁股有点麻麻的";
                            GH_GameManager.instance.playAudio("虽然过来了，但是屁股有点麻麻的")

                            this.scheduleOnce(() => {
                                lb.active = false;
                                const ske = objective.getComponent(sp.Skeleton)
                                ske.setAnimation(0, "animation", true);

                                tween(objective).to(2, { position: v3(-650, -600) })
                                    .call(() => {
                                        GH_GameManager.instance.mask.active = false;
                                        GH_GameManager.instance.refresh()
                                        // objective.destroy()
                                        objective.active = false;
                                    }).start()

                            }, 2);
                        })
                        .start()
                }, 0.3)
            } else {
                this.node.setPosition(this.originalPos)
            }





            // const bol = objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
            // if (bol) {
            //     AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)

            //     GH_GameManager.instance.mask.active = true
            //     const _pos = objective.getPosition()
            //     this.node.setPosition(_pos.x + 100, _pos.y + 200)
            //     const shakingCompent = this.node.getComponent(UI_Shaking);
            //     shakingCompent.Shaking(10, 5)
            //     AudioManager.Instance.PlaySFX(GH_GameManager.instance.ti)

            //     this.scheduleOnce(() => {
            //         shakingCompent.Stop()

            //         objective.setPosition(0, 120)
            //         const uio = this.node.getComponent(UIOpacity)
            //         tween(uio).to(0.5, { opacity: 0 }).start()
            //         tween(objective)
            //             .by(1, { angle: 720 })
            //             .start()
            //         tween(objective)
            //             .to(1, { position: v3(-350, -400) })
            //             .call(() => {
            //                 const lb = objective.getChildByName("Label");
            //                 lb.active = true;
            //                 lb.getChildByName("String").getComponent(Label).string = "虽然过来了，但是屁股有点麻麻的";
            //                 GH_GameManager.instance.playAudio("虽然过来了，但是屁股有点麻麻的")

            //                 this.scheduleOnce(() => {
            //                     lb.active = false;
            //                     const ske = objective.getComponent(sp.Skeleton)
            //                     ske.setAnimation(0, "animation", true);

            //                     tween(objective).to(2, { position: v3(-650, -600) })
            //                         .call(() => {
            //                             GH_GameManager.instance.mask.active = false;
            //                             GH_GameManager.instance.refresh()
            //                             objective.destroy()
            //                         }).start()

            //                 }, 2);
            //             })
            //             .start()
            //     }, 0.3)
            // } else {
            //     this.node.setPosition(this.originalPos)
            // }
        });
    }

}


