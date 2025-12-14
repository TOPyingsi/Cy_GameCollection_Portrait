import { _decorator, Component, EventTouch, Node, UITransform, v2, Vec3 } from 'cc';
import { SHJHZ_GameManager } from './SHJHZ_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJHZ_PropTouch')
export class SHJHZ_PropTouch extends Component {

    index: number;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        AudioManager.Instance.PlaySFX(SHJHZ_GameManager.instance.click)
        const pos = SHJHZ_GameManager.instance.gamePanel.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(pos)
    }

    onTouchMove(event: EventTouch) {
        const pos = SHJHZ_GameManager.instance.gamePanel.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(pos)
    }

    onTouchEnd(event: EventTouch) {
        const worldPos = new Vec3(event.getUILocation().x, event.getUILocation().y);
        const panelPos = SHJHZ_GameManager.instance.currentPanel.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        const isContains = SHJHZ_GameManager.instance.currentPanel.getComponent(UITransform).getBoundingBox().contains(v2(panelPos.x, panelPos.y));
        const panel = SHJHZ_GameManager.instance._map.get(this.node)
        console.log(panel, this.node.name)

        if (isContains) {
            panel.children.forEach(node => {
                if (node.name == this.node.name) {
                    node.active = true;
                    SHJHZ_GameManager.instance.xyy = SHJHZ_GameManager.instance.xyy.filter(node => node.name != this.node.name)
                    this.node.destroy()
                }
            });
            console.warn(SHJHZ_GameManager.instance.xyy);

        } 
    }

}


