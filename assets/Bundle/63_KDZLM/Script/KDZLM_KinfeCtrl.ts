import { _decorator, Component, director, instantiate, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { KDZLM_GameManager } from './KDZLM_GameManager';
const { ccclass, property } = _decorator;

@ccclass('KDZLM_KinfeCtrl')
export class KDZLM_KinfeCtrl extends Component {

    @property(Node) cutBelong: Node = null;
    @property(Prefab) cutItem: Prefab = null;
    @property(Sprite) prop: Sprite = null;
    @property(Vec3) tweenStartPos: Vec3 = null;
    @property(Vec3) tweenEndPos: Vec3 = null;

    _tweenStartPos: Vec3 = new Vec3();
    _endPos: Vec3 = new Vec3();
    onCut: boolean = false;
    last: number = 0;
    lastPos: number = 0;
    clipList: Node[] = [];
    cnt: number = 0;

    protected onEnable(): void {
        director.getScene().on("TOUCH_START", this.TOUCH_START, this);
        director.getScene().on("startGame", this.startGame, this);
    }


    TOUCH_START() {
        this.cnt++;
        this._tweenStartPos = this.node.position.clone();
        this.onCut = true;
        let clip = instantiate(this.cutItem);
        clip.setParent(this.cutBelong);

        clip.getComponent(Sprite).fillStart = this.last;
        let len = (this.node.worldPosition.x) / 1080 - this.last;
        clip.getComponent(Sprite).fillRange = len;
        this.prop.getComponent(Sprite).fillStart += len;
        this.prop.getComponent(Sprite).fillRange = 1;

        this.last += len;
        this.lastPos = this.node.worldPosition.x;
        this.clipList.push(clip);
        for (let i = 0; i < this.clipList.length; i++) {
            this.clipList[i].setWorldPosition(this.clipList[i].worldPosition.x - 3, this.clipList[i].worldPosition.y, 0);
        }
        this.cutBelong.getComponent(UITransform).width = (1080 * this.last)

        tween(this.node).to(0.05, { position: new Vec3(this.node.position.x, 400, 0) }).call(() => {
            this.onCut = false;
            this._tweenStartPos.y = this.tweenStartPos.y;
            this.node.setPosition(this._tweenStartPos);
        }).start();
    }

    startGame() {
        tween(this.node)
            .to(30, { position: this.tweenEndPos })
            .call(() => { this.gameOver() })
            .start();
    }

    gameOver() {
        director.getScene().emit("gameOver", false)
        KDZLM_GameManager.instance.gameOver()
    }

    protected onDisable(): void {
        director.getScene().off("TOUCH_START", this.TOUCH_START, this);
        director.getScene().off("startGame", this.startGame, this);
        director.getScene().off("gameOver", this.gameOver, this);
    }

}


