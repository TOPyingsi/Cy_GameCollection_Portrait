import { _decorator, AudioClip, Component, instantiate, Label, Node, Prefab, tween, UITransform, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('QSJJS_GameMgr')
export class QSJJS_GameMgr extends Component {
    @property(Prefab)
    BaziPrefab: Prefab = null;

    @property(AudioClip)
    FireClip: AudioClip = null;

    public BaziArr: Node[] = [];

    public BaziMgr: Node = null;

    public curBaziNum: number = 8;
    public curType: string = "枪神";

    public fireTime: number = 0;
    public fireTimeLabel: Label = null;

    public foresight: Node = null;

    public GameOver: boolean = false;

    private rotateSpeed: number = 15;
    private radius: number = 400;
    public static instance: QSJJS_GameMgr = null;
    start() {
        QSJJS_GameMgr.instance = this;

        this.BaziMgr = this.node.getChildByName("靶子");
        this.BaziArr = this.BaziMgr.children;
        this.foresight = this.node.getChildByName("准星");

        this.fireTimeLabel = this.node.getChildByName("FireTime").getComponent(Label);

        this.createBazi();
    }

    timer: number = 0;
    a: number = 20;
    update(deltaTime: number) {
        if (this.GameOver) {
            return;
        }

        if (this.isCreate) {
            this.timer += deltaTime;
            this.BaziMgr.eulerAngles = v3(0, 0, this.rotateSpeed + this.a * this.timer);
        }
    }

    isCreate: boolean = false;
    createBazi() {

        for (let i = 0; i < 8; i++) {
            let bazi = instantiate(this.BaziPrefab);
            bazi.parent = this.BaziMgr;

            // 计算每个物体在正八边形上的位置
            let angle = (2 * Math.PI / 8) * i; // 每个物体之间的角度差
            let x = this.BaziMgr.x + this.radius * Math.cos(angle);
            let y = this.BaziMgr.y + this.radius * Math.sin(angle);

            // 设置物体的位置
            bazi.setPosition(x, y, 0);

            // 可选：让物体朝向中心点
            // bazi.angle = -angle * 180 / Math.PI;
        }

        this.fireTimeLabel.string = "开了" + this.fireTime.toString() + "枪\n" + this.curType;

        this.isCreate = true;
    }

    Fire() {
        if (this.GameOver) {
            return;
        }

        this.fireTime += 1;

        AudioManager.Instance.PlaySFX(this.FireClip);

        if (this.fireTime === 9) {
            this.curType = "高手";
        }
        if (this.fireTime === 11) {
            this.curType = "新手"
        }
        if (this.fireTime >= 13) {
            this.curType = "人机";
        }

        this.fireTimeLabel.string = "开了" + this.fireTime.toString() + "枪\n" + this.curType;

        let touchPos = this.foresight.worldPosition;
        let isTruePos = this.isHit(touchPos);
        if (isTruePos) {
            this.curBaziNum--;
            this.a += 25;
            if (this.curBaziNum === 0) {
                this.Win();
            }
        }
    }

    isHit(touchPos: Vec3): boolean {
        for (let i = 0; i < this.BaziArr.length; i++) {

            if (!this.BaziArr[i].active) {
                continue;
            }

            let uiTrans = this.BaziArr[i].getComponent(UITransform);

            let pointX = this.BaziArr[i].worldPosition.x - uiTrans.width / 2;
            let pointY = this.BaziArr[i].worldPosition.y - uiTrans.height / 2;

            if (touchPos.x > pointX
                && touchPos.y > pointY
                && touchPos.x < pointX + uiTrans.width
                && touchPos.y < pointY + uiTrans.height) {
                this.BaziArr[i].active = false;
                console.log("当前剩下" + this.BaziArr.length + "个靶子");
                return true;
            }
        }

        return false;
    }

    Win() {
        this.GameOver = true;

        this.scheduleOnce(() => {
            let shine = this.node.getChildByName("shine");
            shine.active = true;
        }, 0.2);

        tween(this.fireTimeLabel.node)
            .to(0.2, { position: v3(0, 0, 0), scale: v3(2, 2, 2) })
            .call(() => {
            })
            .start();

        this.scheduleOnce(() => {
            GamePanel.Instance.Win();
        }, 2);
    }
}


