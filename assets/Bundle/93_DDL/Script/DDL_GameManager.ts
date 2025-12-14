import { _decorator, AudioClip, Component, director, Event, find, instantiate, Label, Node, ParticleSystem2D, Prefab, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v3 } from 'cc';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { DDL_ItemCtel } from './DDL_ItemCtrl';
import { DDL_MapCtrl } from './DDL_MapCtrl';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('DDL_GameManager')
export class DDL_GameManager extends Component {

    public static instance: DDL_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) gameArea: Node = null;
    @property(Node) map: Node = null;
    @property(Node) blackMask: Node = null;
    @property(Prefab) item: Prefab = null;
    @property(Prefab) hand: Prefab = null;
    @property(Prefab) mapPanel: Prefab = null;
    @property(Node) title: Node = null;
    @property(Node) addten: Node = null;
    @property(Prefab) ovo: Prefab = null;
    @property([SpriteFrame]) sfs: SpriteFrame[] = [];

    @property(AudioClip) bgm: AudioClip = null;
    @property(AudioClip) click: AudioClip = null;
    @property(Prefab) answer: Prefab = null;

    list: string[] = [];
    activeNodes: Node[] = [];
    num: number = 10;
    masks: Node[] = [];
    count: number = 40;

    protected onLoad(): void {
        DDL_GameManager.instance = this;
        this.gamePanel.time = 600;
        this.refreshTitle();
    }

    protected start(): void {
        AudioManager.Instance.PlayBGM(this.bgm)
        this.gamePanel.answerPrefab = this.answer;
    }

    addCount() {
        this.addten.active = false;
        this.count += 10;
        for (let i = 0; i < 10; i++) {
            const random = Tools.GetRandomInt(0, this.masks.length)
            this.masks[random].active = true;
            this.masks = this.masks.filter(item => item != this.masks[random]);
        }
    }

    onButtonClick(event: Event) {
        AudioManager.Instance.PlaySFX(this.click)
        this.blackMask.active = true
        const hand = instantiate(this.hand)
        hand.setPosition(event.target.position)
        hand.setParent(this.gameArea)
        this.count--;

        tween(hand)
            .to(0.3, { angle: 30 })
            .call(() => {
                hand.destroy();
                event.target.active = false;
                this.masks.push(event.target);
                const tvt = instantiate(this.ovo)
                tvt.setParent(find("Canvas/GameArea/背景"))
                tvt.setSiblingIndex(event.target.getSiblingIndex() - 1)
                tvt.setPosition(event.target.position)
                tvt.active = true;

                const item = instantiate(this.item)
                const sf = this.sfs[Tools.GetRandomInt(0, this.sfs.length)]
                const bol = this.list.includes(sf.name)
                if (!bol) {
                    this.list.push(sf.name)
                }

                item.name = sf.name;
                const worldPos = event.target.getWorldPosition()
                const localPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(worldPos)

                const component = item.getComponent(DDL_ItemCtel)
                this.num -= 1;
                this.refreshTitle();
                component.init(sf, localPos, bol, this.num)
                item.setParent(this.gameArea)

                if (this.count == 0) this.addten.active = true;
            })
            .start();
    }

    initMap() {
        const mapPanel = instantiate(this.mapPanel)
        const component = mapPanel.getComponent(DDL_MapCtrl)
        component.init(this.list)
        mapPanel.setParent(this.gameArea)
    }

    refreshTitle() {
        this.title.getChildByName("Label").getComponent(Label).string = String(this.num);
    }

}


