import { _decorator, Component, director, instantiate, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { GLDS_GameManager } from './GLDS_GameManager';
import { GLDS_AudioManager } from './GLDS_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('knifeController')
export class knifeController extends Component {

    @property(Node) PlayAreaNode: Node = null;
    @property(Node) cutBelong: Node = null;
    @property(Prefab) cutItem: Prefab = null;
    @property(Sprite) fishBG: Sprite = null;
    @property(Vec3) xstartPos: Vec3 = null;
    // xstartPos: Vec3 = new Vec3(-420.557, -491.568);
    ystartPos: Vec3 = new Vec3();
    yendPos: Vec3 = new Vec3();

    onCut: boolean = false;
    last: number = 0;
    lastPos: number = 0;

    clipList: Node[] = [];
    cnt: number = 0;

    protected onEnable(): void {
        director.getScene().on("TOUCH_START", this.TOUCH_START, this);
    }


    TOUCH_START() {
        GLDS_GameManager.Instance.cutFish();
        GLDS_AudioManager.Instance.playQie();
        this.cnt++;
        this.ystartPos = this.node.position.clone();
        this.onCut = true;
        let clip = instantiate(this.cutItem);
        clip.setParent(this.cutBelong);

        clip.getComponent(Sprite).fillStart = this.last;
        let len = (this.node.worldPosition.x) / 1080 - this.last;
        clip.getComponent(Sprite).fillRange = len;
        this.fishBG.getComponent(Sprite).fillStart += len;
        this.fishBG.getComponent(Sprite).fillRange = 1;

        this.last += len;
        this.lastPos = this.node.worldPosition.x;
        this.clipList.push(clip);
        for (let i = 0; i < this.clipList.length; i++) {
            this.clipList[i].setWorldPosition(this.clipList[i].worldPosition.x - 3, this.clipList[i].worldPosition.y, 0);
        }
        this.cutBelong.getComponent(UITransform).width = (1080 * this.last)

        tween(this.node).to(0.05, { position: new Vec3(this.node.position.x, 400, 0) }).call(() => {
            this.onCut = false;
            this.ystartPos.y = this.xstartPos.y;
            this.node.setPosition(this.ystartPos);
        }).start();
    }

    protected onDisable(): void {
        director.getScene().off("TOUCH_START", this.TOUCH_START, this);
    }

}


