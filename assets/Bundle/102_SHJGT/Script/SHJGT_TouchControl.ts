import { _decorator, AnimationComponent, Component, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { SHJGT_Level } from './SHJGT_Level';
import { SHJGT_GameMgr } from './SHJGT_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJGT_TouchControl')
export class SHJGT_TouchControl extends Component {

    @property()
    propID: number = 0;

    @property()
    public needTalk: boolean = false;

    @property(Node)
    targetNode: Node = null;

    public levelMgr: SHJGT_Level = null;

    @property()
    public isLock: boolean = true;
    private isTruePos: boolean = false;

    private startPos: Vec3 = null;
    private targetPos: Vec3 = null;
    private targetChildID: number = 0;
    private childID: number = 0;

    onTouchStart(event: EventTouch) {


        SHJGT_GameMgr.instance.playMgrSFX("物品");

        if (this.targetNode) {
            //第四关第四步
            let flag1 = this.levelMgr.levelID === 3 && this.propID === 3;
            //第三关第三步
            let flag2 = this.levelMgr.levelID === 2 && this.propID === 2;
            //第二关第二步
            let flag3 = this.levelMgr.levelID === 1 && this.propID === 1;

            if (flag1 || flag2 || flag3) {
                this.isTruePos = true;
                return;
            }

            this.targetNode.parent = SHJGT_GameMgr.instance.node;

        }
        else {
            this.node.parent = SHJGT_GameMgr.instance.node;

            this.node.worldPosition = v3(event.getUILocation().x, event.getUILocation().y, 0);
        }

    }

    onTouchMove(event: EventTouch) {

        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        const offset = v3(touchPos.x, touchPos.y, 0).subtract(this.startPos);

        // 更新位置
        if (this.targetNode) {
            //第二关第二部不隐藏窗户
            let flag1 = this.levelMgr.levelID === 3 && this.propID === 3;
            let flag2 = this.levelMgr.levelID === 2 && this.propID === 2;
            if (flag1 || flag2) { }
            else {
                this.targetNode.worldPosition = offset.add(this.targetPos);
            }

        }
        this.node.worldPosition = offset.add(this.startPos);

        let target = this.levelMgr.targetArr[this.propID];

        let uitrans = target.getComponent(UITransform);
        let pointX = target.worldPosition.x - uitrans.width / 2;
        let pointY = target.worldPosition.y - uitrans.height / 2;

        if (touchPos.x >= pointX
            && touchPos.y >= pointY
            && touchPos.x <= uitrans.width + pointX
            && touchPos.y <= uitrans.height + pointY) {
            //拖拽到了正确位置

            this.isTruePos = true;
        }
        else {
            this.isTruePos = false;
        }

    }

    onTouchEnd(event: EventTouch) {
        if (this.targetNode) {

            this.targetNode.worldPosition = this.targetPos;

            this.targetNode.parent = this.node.parent.parent;

            this.targetNode.setSiblingIndex(this.targetChildID);

        } else {
            this.node.parent = this.levelMgr.BgNode.getChildByName("props");
            this.node.setSiblingIndex(this.childID);
        }

        if (this.isLock || !this.isTruePos || SHJGT_GameMgr.instance.isTalking) {

            this.node.worldPosition = this.startPos;

            return;
        }

        if (this.targetNode) {
            this.targetNode.active = false;
        }

        this.node.worldPosition = this.startPos;

        this.node.active = false;

        //第四关第一步需要隐藏蝌蚪
        if (this.levelMgr.levelID === 3 && this.propID === 0) {
            this.levelMgr.BgNode.getChildByName("蝌蚪").active = false;
            this.levelMgr.BgNode.getChildByName("青蛙").active = true;
        }

        //第二关第二部不隐藏窗户
        if (this.levelMgr.levelID === 1 && this.propID === 1) {
            this.targetNode.active = true;
        }

        if (this.levelMgr.levelID === 2 && this.propID === 3) {
            this.levelMgr.node.getComponent(AnimationComponent).play();
        }

        this.levelMgr.nextStep(this.propID, this.needTalk);

    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    public initData() {

        this.startPos = this.node.worldPosition.clone();

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        //当前关卡脚本管理
        this.levelMgr = this.node.parent.parent.parent.getComponent(SHJGT_Level);

        if (this.propID === 0) {
            this.isLock = false;
        }

        if (this.targetNode) {
            this.targetPos = this.targetNode.worldPosition.clone();
            this.targetChildID = this.targetNode.getSiblingIndex();
            console.log(this.targetChildID);
        }

        this.childID = this.node.getSiblingIndex();
    }

}