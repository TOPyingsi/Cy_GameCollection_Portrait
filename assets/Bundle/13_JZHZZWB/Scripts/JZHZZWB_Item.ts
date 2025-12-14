import { _decorator, Animation, AnimationClip, Component, EventTouch, find, Node, Rect, UITransform } from 'cc';
import { JZHZZWB_LVController } from './JZHZZWB_LVController';
import { JZHZZWB_TYPE } from './JZHZZWB_Constant';
const { ccclass, property } = _decorator;

@ccclass('JZHZZWB_Item')
export class JZHZZWB_Item extends Component {

    WorldBoundingBox: Rect = new Rect();

    Type: JZHZZWB_TYPE = JZHZZWB_TYPE.TYPE1;

    IsClick: boolean = false;
    IsPlaying: boolean = false;

    Animation: Animation = null;
    AnimationClip: AnimationClip = null;

    protected onLoad(): void {
        this.Animation = find("Icon", this.node).addComponent(Animation);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected start(): void {
        JZHZZWB_LVController.Instance.Items.push(this);
        this.initWorldBoundingBox();
    }

    initWorldBoundingBox() {
        // 获取节点的位置（左下角位置）
        let pos = this.node.getWorldPosition();
        // 获取节点的 contentSize（即宽度和高度）
        let contentSize = this.node.getComponent(UITransform).contentSize;

        // 计算包围盒
        let minX = pos.x;  // 左下角 X 坐标
        let maxX = pos.x + contentSize.width;  // 右上角 X 坐标
        let minY = pos.y;  // 左下角 Y 坐标
        let maxY = pos.y + contentSize.height;  // 右上角 Y 坐标

        // 创建世界坐标下的包围盒
        this.WorldBoundingBox = new Rect(minX, minY, maxX - minX, maxY - minY);
    }

    check(type: JZHZZWB_TYPE, pos): boolean {
        if (this.WorldBoundingBox.contains(pos) && !this.IsClick) {
            this.Type = type;
            this.IsClick = true;
            this.IsPlaying = true;
            this.AnimationClip = JZHZZWB_LVController.Instance.AnimationClips[this.Type];
            JZHZZWB_LVController.Instance.playSound(this.Type);
            this.Animation.addClip(this.AnimationClip);
            this.Animation.play(this.Type.toString());
            return true;
        }
        return false;
    }

    onTouchEnd(event: EventTouch) {
        if (!this.IsClick) return;
        this.IsPlaying = !this.IsPlaying;
        if (this.IsPlaying) {
            JZHZZWB_LVController.Instance.playSound(this.Type);
            this.Animation.play(this.Type.toString());
        } else {
            JZHZZWB_LVController.Instance.stopSound(this.Type);
            this.Animation.stop();
        }
    }

}


