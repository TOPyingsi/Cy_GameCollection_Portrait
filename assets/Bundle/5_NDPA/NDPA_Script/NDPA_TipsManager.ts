import { _decorator, Camera, Component, errorID, find, Node, Sprite, UITransform, v3, Vec3, view } from 'cc';
import { NDPA_GameManager } from './NDPA_GameManager';
import { NDPA_Clickable } from './NDPA_Clickable';
const { ccclass, property } = _decorator;

@ccclass('NDPA_TipsManager')
export class NDPA_TipsManager extends Component {
    public static Instance: NDPA_TipsManager = null;

    @property(Camera)
    MainCamera: Camera = null;

    @property(Node)
    Tips: Node = null;

    @property({ type: Vec3 })
    Offset: Vec3 = null;

    Target: Node = null;
    TargetTips: Node[] = [];

    protected onLoad(): void {
        NDPA_TipsManager.Instance = this;
    }

    startTips() {
        this.Tips.active = true;
        this.Target = this.TargetTips[0];
        this.getTips();
    }

    //获取target的小手
    getTips() {
        // 获取3D模型的世界坐标
        const worldPos = this.Target.getWorldPosition();
        // 将世界坐标转换为UI坐标
        const uiPos = this.MainCamera.convertToUINode(worldPos, find("Canvas"));
        // 设置UI元素的位置
        const offset: Vec3 = this.Target.getComponent(NDPA_Clickable).Offset;
        this.Tips.setPosition(uiPos.add(offset));
    }

    checkTarget(clickNode: Node) {
        //玩家点击到了提示
        if (clickNode === this.Target) {
            this.popFirst();
            return true;
        } else {
            // console.error("玩家没按提示的来");
            return false;
        }

    }

    gamePause() {
        this.Tips.active = false;
    }

    gameResume() {
        if (NDPA_GameManager.Instance.isTipsPattern) this.Tips.active = true;
    }

    popFirst() {
        if (this.TargetTips.length > 0) {
            this.TargetTips.splice(0, 1);

            if (this.TargetTips.length > 0) {
                this.Target = this.TargetTips[0];
                this.getTips();
            } else {
                this.Target = null;
                this.Tips.active = false;
            }
        }
    }

    clear() {
        this.TargetTips = [];
        this.Tips.active = false;
    }

}


