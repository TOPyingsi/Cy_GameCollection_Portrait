import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Rect, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import { NZCK_Box } from './NZCK_Box';
import { NZCK_Container } from './NZCK_Container';
import { NZCK_CARDNAME, NZCK_CARDTYPE } from './NZCK_Constant';
import { Tools } from '../../../Scripts/Framework/Utils/Tools';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { NZCK_SoundController, NZCK_Sounds } from './NZCK_SoundController';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NZCK_LVController')
export class NZCK_LVController extends Component {
    public static Instance: NZCK_LVController = null;

    @property(GamePanel)
    GamePanel: GamePanel = null;

    @property(Node)
    DMItem: Node[] = [];

    @property(Node)
    Icon: Node = null;

    @property(UIOpacity)
    MaskUIOpacity: UIOpacity = null;

    @property(Node)
    Panel: Node = null;

    @property(Node)
    Boxs: Node[] = [];

    @property(UITransform)
    BoxUItransform: UITransform = null;

    @property(Node)
    JD: Node = null;

    @property(Node)
    JD2: Node = null;

    @property(Node)
    Card: Node = null;

    @property(Sprite)
    CardSprites: Sprite[] = [];

    @property(UIOpacity)
    CardUIOpacity: UIOpacity = null;

    @property(Node)
    JD3: Node = null;

    @property(Node)
    Hand: Node = null;

    @property(SpriteFrame)
    SFs: SpriteFrame[] = [];

    @property(Sprite)
    CardBack: Sprite = null;

    @property(Node)
    CardPanel: Node = null;

    @property(Node)
    CardParent: Node = null;

    @property(NZCK_Container)
    Containers: NZCK_Container[] = [];

    @property(NZCK_Container)
    ShowContainers: NZCK_Container[] = [];

    @property(Node)
    OverPanel: Node = null;

    @property(Node)
    ProbabilityPanel: Node = null;

    CurStep: number = 1;

    IsClickBox: boolean = false;
    JD2Pos: Vec3 = new Vec3();
    BoxRect: Rect = new Rect();
    CardPos: Vec3 = new Vec3();
    CardScale: Vec3 = new Vec3();
    CardUIOpacityPos: Vec3 = new Vec3();
    JD3Pos: Vec3 = new Vec3();
    HandPos: Vec3 = new Vec3();

    HandCardNum: number = 0;
    CurWave: number = 0;

    IsClick: boolean = false;//能否点击
    TargetBoxTs: NZCK_Box = null;

    private _isClick: boolean = false;

    protected onLoad(): void {
        NZCK_LVController.Instance = this;
        this.JD2Pos = this.JD2.getPosition().clone();
        this.BoxRect = this.BoxUItransform.getBoundingBoxToWorld();
        this.CardPos = this.Card.getWorldPosition().clone();
        this.CardScale = this.Card.getScale().clone();
        this.CardUIOpacityPos = this.CardUIOpacity.node.getWorldPosition().clone();
        this.JD3Pos = this.JD3.getWorldPosition().clone();
        this.HandPos = this.Hand.getWorldPosition().clone();

        this.Hand.setWorldPosition(this.HandPos.clone().add3f(1000, 0, 0));
        this.GamePanel.winStr = "太棒了！来试试我家的其他盲盒吧！"
    }

    protected start(): void {
        this.DMItem.map(e => e.active = false);
        this.showDM();
        this.IconShake();
    }

    showDM() {
        if (this.DMItem.length <= 0) {
            return;
        }
        this.scheduleOnce(() => {
            const item = this.DMItem.shift();
            item.setSiblingIndex(0);
            item.active = true;
            this.showDM();
        }, 1)
    }

    IconShake() {
        tween(this.Icon)
            .to(1, { scale: v3(1, 1.03, 1) })
            .to(1, { scale: v3(1, 1, 1) })
            .union()
            .repeatForever()
            .start();
    }

    showMask(index: number) {
        tween(this.MaskUIOpacity)
            .to(2, { opacity: 255 }, { easing: `sineOut` })
            .call(() => {
                this.Panel.active = true;
                this.showBox(index);
            })
            .to(2, { opacity: 0 }, { easing: `sineOut` })
            .start();
    }

    showBox(index: number) {
        this.CardBack.spriteFrame = this.SFs[index];
        const target = this.Boxs[index];
        this.TargetBoxTs = target.getComponent(NZCK_Box);
        this.TargetBoxTs.show();
        // this.showJD();
    }

    showJD() {
        tween(this.JD)
            .by(1, { position: v3(-700, 0, 0) }, { easing: `sineOut` })
            .start();
    }

    showJD2() {
        this.JD2.active = true;
        tween(this.JD2)
            .by(0.5, { position: v3(-300, 460, 0) }, { easing: `sineOut` })
            .call(() => {
                this.JD2.setPosition(this.JD2Pos);
                this.JD2.active = false;
                //撕膜
                this.TargetBoxTs.peel();
            })
            .start();
    }

    checkByRect(rect: Rect) {
        // const isChecked = this.BoxRect.containsRect(rect);
        const isChecked = this.BoxRect.intersects(rect);
        if (isChecked) {
            NZCK_SoundController.Instance.PlaySound(NZCK_Sounds.SM);
            if (this.CurStep == 1) {
                this.CurStep++;
                this.showJD2();
            } else {
                this.startCK();
            }
        }
        return isChecked;
    }

    showCard() {
        this.Card.setScale(this.CardScale);
        this.Card.setWorldPosition(this.CardPos);
        this.Card.active = true;
        tween(this.Card)
            .by(1, { position: v3(0, -250, 0) }, { easing: `sineOut` })
            .call(() => {
                this.Card.active = false;
                this.showCK();
                this.showJD();
                // this.Card.setScale(Vec3.ONE);
            })
            .start();
    }

    //拆卡过程
    showCK() {
        this.CardUIOpacity.opacity = 255;
        this.CardUIOpacity.node.setWorldPosition(this.CardUIOpacityPos);
        this.CardSprites[0].fillRange = 0;
        this.CardSprites[1].fillRange = 1;
        this.JD3.setWorldPosition(this.JD3Pos);
        this.CardBack.node.active = true;

    }

    startCK() {
        this.JD3.active = true;

        tween(this.JD3)
            .by(1, { position: v3(-350, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                this.JD3.active = false;
                tween(this.CardUIOpacity)
                    .to(1, { opacity: 0 }, { easing: `sineOut` })
                    .start();
                tween(this.CardUIOpacity.node)
                    .by(1, { position: v3(0, -500, 0) }, { easing: `sineOut` })
                    .call(() => {
                        this.turnOver();
                    })
                    .start();
            })
            .start();

        tween(this.CardSprites[0])
            .to(1, { fillRange: -1 }, { easing: `sineOut` })
            .start();

        tween(this.CardSprites[1])
            .to(1, { fillRange: 0 }, { easing: `sineOut` })
            .start();
    }

    //卡片翻面
    turnOver() {
        tween(this.CardPanel)
            .to(1, { eulerAngles: v3(0, 90, 0) }, { easing: `sineOut` })
            .call(() => {
                this.CardBack.node.active = false;
                this.CardParent.active = true;
                this.showContainer();
                this.CurWave++;
                this.createCard();
            })
            .to(1, { eulerAngles: v3(0, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                this.Hand.active = true;
                this.showHand();
            })
            .start();
    }

    showHand() {
        this.Hand.active = true;
        tween(this.Hand)
            .to(1, { worldPosition: this.HandPos.clone() }, { easing: `sineOut` })
            .call(() => {
                //开始点击
                this.IsClick = true;
            })
            .start()
    }

    hideHand() {
        tween(this.Hand)
            .to(1, { worldPosition: this.HandPos.clone().add3f(1000, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                //开始点击
                this.IsClick = false;
                this.Hand.active = false;
            })
            .start()
    }

    showContainer() {
        this.Containers.forEach(e => e.node.active = true);
    }

    closeContainer() {
        this.Containers.forEach(e => e.node.active = false);
    }

    createCard(number: number = 3) {
        if (number <= 0) return;
        const name = Tools.GetRandomItemFromArray(NZCK_CARDNAME);
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, `Prefabs/${name}`).then((prefab: Prefab) => {
            const card = instantiate(prefab);
            card.parent = this.CardParent;
            card.setPosition(Vec3.ZERO);
            this.HandCardNum++;
            this.createCard(number - 1);
        })
    }

    addCard(type: NZCK_CARDTYPE, card: Node) {
        this.Containers[type].addCard(card);
    }

    next() {
        if (this.CurWave >= 3) {
            console.error(`结束`);
            this.showContainerMask();
            return;
        }

        this.closeContainer();
        this.hideHand();
        this.TargetBoxTs.showBoxOpen();
    }

    addShowContainer() {
        for (let i = 0; i < this.ShowContainers.length; i++) {
            this.ShowContainers[i].addCards(this.Containers[i].Cards);
        }
    }

    showContainerMask() {
        tween(this.MaskUIOpacity)
            .to(2, { opacity: 255 }, { easing: `sineOut` })
            .call(() => {
                this.Panel.active = false;
                this.OverPanel.active = true;
                this.addShowContainer();
            })
            .to(2, { opacity: 0 }, { easing: `sineOut` })
            .start();
    }

    showOverMask() {
        if (this._isClick) return;
        this._isClick = true;
        NZCK_SoundController.Instance.PlaySound(NZCK_Sounds.SM);
        tween(this.MaskUIOpacity)
            .to(2, { opacity: 255 }, { easing: `sineOut` })
            .call(() => {
                this.OverPanel.active = false;
            })
            .to(2, { opacity: 0 }, { easing: `sineOut` })
            .call(() => {
                this.GamePanel.Win();
            })
            .start();
    }

    onProbabilityClick(event: EventTouch) {
        NZCK_SoundController.Instance.PlaySound(NZCK_Sounds.Click);
        switch (event.getCurrentTarget().name) {
            case "概率":
                this.ProbabilityPanel.active = true;
                break;
            case "退出":
                this.ProbabilityPanel.active = false;
                break;
        }
    }
}


