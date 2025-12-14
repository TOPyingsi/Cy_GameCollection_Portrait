import { _decorator, BoxCollider2D, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BDSN_Box')
export class BDSN_Box extends Component {

    top: boolean = false;
    bottom: boolean = false;
    left: boolean = false;
    right: boolean = false;
    x: number = 0;
    y: number = 0;
    type: number = 0;

    init(top: boolean, bottom: boolean, left: boolean, right: boolean, x: number, y: number, type: number) {
        console.log("上", top, "下", bottom, "左", left, "右", right, "x", x, "y", y);
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.x = x;
        this.y = y;
        this.type = type;

        // this.node.getChildByName("Top").active = top;
        // this.node.getChildByName("Bottom").active = bottom;
        // this.node.getChildByName("Left").active = left;
        // this.node.getChildByName("Right").active = right;
        this.scheduleOnce(() => {
            this.node.getChildByName("Top").getComponent(BoxCollider2D).enabled = top;
            this.node.getChildByName("Bottom").getComponent(BoxCollider2D).enabled = bottom;
            this.node.getChildByName("Left").getComponent(BoxCollider2D).enabled = left;
            this.node.getChildByName("Right").getComponent(BoxCollider2D).enabled = right;
        })

    }

    updateSide(top: boolean, bottom: boolean, left: boolean, right: boolean) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.scheduleOnce(() => {
            this.node.getChildByName("Top").getComponent(BoxCollider2D).enabled = top;
            this.node.getChildByName("Bottom").getComponent(BoxCollider2D).enabled = bottom;
            this.node.getChildByName("Left").getComponent(BoxCollider2D).enabled = left;
            this.node.getChildByName("Right").getComponent(BoxCollider2D).enabled = right;
        })
    }
}