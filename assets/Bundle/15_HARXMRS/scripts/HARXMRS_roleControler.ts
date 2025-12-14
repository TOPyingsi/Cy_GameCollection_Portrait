import { _decorator, Color, Component, director, EventTouch, Input, Label, math, Node, sp, Sprite, Texture2D, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('roleControler')
export class roleControler extends Component {

    startPos: Vec2;
    endPos: Vec2;
    @property(Node)
    leftNode: Node; // women
    @property(Node)
    rightNode: Node; // men
    leftSk: sp.Skeleton; // 左
    rightSk: sp.Skeleton;// 右
    leftName: string = "women";
    rightName: string = "men";

    @property(sp.Skeleton)
    menSk: sp.Skeleton;
    @property(sp.Skeleton)
    womenSk: sp.Skeleton;
    @property(Node)
    womenLog: Node;
    @property(Node)
    menLog: Node;
    @property(Texture2D)
    texture2d: Texture2D;
    cnt: number = 0;
    @property(Node)
    cill: Node;

    cillBf: Vec3;

    winCnt: number = 0;

    lastLevelType: number = 0;

    setWomenLog(s: string) {
        this.womenLog.getComponentInChildren(Label).string = s;
    }
    setmenLog(s: string) {
        this.menLog.getComponentInChildren(Label).string = s;
    }
    appearWomenLog() {
        this.womenLog.getComponent(Sprite).color = new Color(255, 255, 255, 255);
    }
    disappearWomenLog() {
        this.womenLog.getComponent(Sprite).color = new Color(255, 255, 255, 0);
    }
    appearmenLog() {
        this.menLog.getComponent(Sprite).color = new Color(255, 255, 255, 255);
    }
    disappearmenLog() {
        this.menLog.getComponent(Sprite).color = new Color(255, 255, 255, 0);
    }
    appearCill() {
        if (this.cillBf == null) return;
        this.cill.setScale(this.cillBf);
    }
    disappearCill() {
        this.cillBf = this.cill.scale.clone();
        this.cill.setScale(0, 0, 0);
    }

    swap() {
        let a = this.leftNode.position.clone();
        let b = this.rightNode.position.clone();
        this.cnt++;
        if (this.cnt % 2 == 0) {
            this.leftSk = this.leftNode.getComponentInChildren(sp.Skeleton);
            this.rightSk = this.rightNode.getComponentInChildren(sp.Skeleton);
            this.leftName = "women";
            this.rightName = "men";
        } else {
            this.leftSk = this.rightNode.getComponentInChildren(sp.Skeleton);
            this.rightSk = this.leftNode.getComponentInChildren(sp.Skeleton);

            this.leftName = "men";
            this.rightName = "women";
        }
        this.leftNode.setScale(this.leftNode.scale.x * -1, this.leftNode.scale.y);
        this.womenLog.getComponentInChildren(Label).node.setScale(this.womenLog.getComponentInChildren(Label).node.scale.x * -1, this.womenLog.scale.y);
        this.rightNode.setScale(this.rightNode.scale.x * -1, this.rightNode.scale.y);
        this.menLog.getComponentInChildren(Label).node.setScale(this.menLog.getComponentInChildren(Label).node.scale.x * -1, this.menLog.scale.y);
        tween(this.leftNode).to(0.1, { position: b }).call(() => { }).start();
        tween(this.rightNode).to(0.1, { position: a }).call(() => { }).start();
    }

    setLeftColor(name: string, a: number) {
        // console.log(this.leftSk);
        this.leftSk.findSlot(name).color.a = a;
    }
    setRightColor(name: string, a: number) {
        // console.log(this.rightSk);
        this.rightSk.findSlot(name).color.a = a;
    }



    protected onLoad(): void {
        this.leftSk = this.leftNode.getComponentInChildren(sp.Skeleton);
        this.rightSk = this.rightNode.getComponentInChildren(sp.Skeleton);
        this.disappearWomenLog();
        this.disappearmenLog();
        {
            this.setLeftColor("暖宝宝", 0);
            this.setLeftColor("短裤", 0);
            this.setLeftColor("袜子", 0);
            this.setLeftColor("退热贴", 0);
            this.setLeftColor("长袖长裤", 0);
        }
        {
            this.setRightColor("袜子", 0);
            this.setRightColor("裤子", 1);
            this.setRightColor("退热贴", 0);
            this.setRightColor("暖宝宝", 0);
        }
    }

    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Input.EventType.TOUCH_END, this.TOUCH_END, this);
        director.getScene().on("changeSkinRight", this.setRightColor, this);
        director.getScene().on("changeSkinLeft", this.setLeftColor, this);
        director.getScene().on("addWin", this.addWin, this);
    }
    addWin() {
        this.winCnt++;
    }
    TOUCH_START(event: EventTouch) {
        this.startPos = event.getUILocation();
    }

    TOUCH_END(event: EventTouch) {
        this.endPos = event.getUILocation();
        if (Math.abs(this.endPos.x - this.startPos.x) >= 50) {
            this.swap();
        }
    }

    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.off(Input.EventType.TOUCH_END, this.TOUCH_END, this);
        director.getScene().off("changeSkinRight", this.setRightColor, this);
        director.getScene().off("changeSkinLeft", this.setLeftColor, this);
        director.getScene().off("addWin", this.addWin, this);
    }
}


