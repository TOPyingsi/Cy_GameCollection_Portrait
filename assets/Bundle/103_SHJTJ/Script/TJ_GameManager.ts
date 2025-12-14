import { _decorator, Color, Component, Event, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { TJ_Icon } from './TJ_Icon';
import { TJ_Map } from './TJ_Map';
import { TJ_AudioManager } from './TJ_AudioManager';
import { TJ_Check } from './TJ_Check';
const { ccclass, property } = _decorator;

@ccclass('TJ_GameManager')
export class TJ_GameManager extends Component {
    public static instance: TJ_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(Prefab) map: Prefab = null;
    @property(Prefab) card: Prefab = null;
    @property(Prefab) sum: Prefab = null;
    @property(Prefab) icon: Prefab = null;
    @property(Prefab) prop: Prefab = null;
    @property(Prefab) answer: Prefab = null;

    @property(Label) title: Label = null;
    @property(Label) roleName: Label = null;

    @property(Node) gameArea: Node = null;
    @property(Node) bottom2: Node = null;
    @property(Node) bottom3: Node = null;
    @property(Node) body: Node = null;
    @property(Node) mask: Node = null;
    @property(Node) r: Node = null;
    @property(Node) f: Node = null;
    @property([Node]) cards1: Node[] = [];
    @property([Node]) cards2: Node[] = [];

    @property(ScrollView) scrollView: ScrollView = null;

    @property([SpriteFrame]) iconSF: SpriteFrame[] = [];

    private _map: Node = null;
    private activeItemList: Node[] = [];
    round: number = 0;
    failNumber: number = 10;

    /** 存储所有角色的SpriteFrame 不会改变 */
    allRoles: SpriteFrame[] = [];
    activeRoles: string[] = [];
    currentBottom: Node = null;
    currentCards: Node[] = [];
    props: Node[] = [];

    /** key currentCards中的card ， value 为实例化出来的道具 */
    cardMap: Map<Node, Node> = new Map();
    /** key 为实例化出来的道具 ， value 为scrollView中的道具图标节点 */
    propMap: Map<Node, Node> = new Map();

    protected onLoad(): void {
        TJ_GameManager.instance = this;
        this.allRoles = this.iconSF
    }

    protected start(): void {
        this.gamePanel.time = 600;
        this.gamePanel.answerPrefab = this.answer;
        const ns = Tools.Shuffle(this.scrollView.content.children);
        this.scrollView.content.removeAllChildren();
        ns.forEach(child => {
            this.scrollView.content.addChild(child);
        });
        this.init();
    }

    currentRole: Node = null;

    init() {
        console.log("init", this.activeRoles);
        if (this.currentRole) {
            this.currentRole.destroy()
            this.currentRole = null
        }
        const num = Tools.GetRandomInt(0, this.iconSF.length)
        const icon = instantiate(this.icon)
        const _sf = this.iconSF[num]
        icon.getComponent(TJ_Icon).init(_sf, this.body);
        this.iconSF = this.iconSF.filter(sf => sf != _sf);
        icon.parent = this.body;
        icon.name = _sf.name;
        this.roleName.string = _sf.name;
        this.currentRole = icon;

        this.loadBototm()
    }

    /**
     * 加载合成框
     */
    loadBototm() {
        switch (this.currentRole.name) {
            case "仙人掌大象": case "仙人掌骆驼": case "土拨鼠枪手": case "土星牛": case "橙子长颈鹿":
            case "罐子兄弟": case "西瓜长颈鹿": case "长靴钢琴马": case "鸽子侦探": case "大鹅轰炸机": case "鳄鱼轰炸机":
                this.bottom3.active = true;
                this.bottom2.active = false;
                this.currentBottom = this.bottom3;
                this.currentCards = this.cards2;
                break;

            default:
                this.bottom2.active = true;
                this.bottom3.active = false;
                this.currentBottom = this.bottom2;
                this.currentCards = this.cards1;
                break;
        }
        console.log(this.currentRole.name, TJ_Check.instance.combinations.get(this.currentRole.name));
    }

    mapButton(event: Event) {
        if (this._map) {
            this._map.destroy();
            this._map = null;
        }
        else {
            this._map = instantiate(this.map);
            this._map.getComponent(TJ_Map).init(this.allRoles);
            this._map.parent = this.gameArea;
            this._map.setSiblingIndex(event.target.getSiblingIndex())
        }
    }

    right() {
        this.mask.active = true
        this.r.active = true;
        const sp = this.currentRole.getComponent(Sprite)
        sp.color = new Color(255, 255, 255, 255);
        const time = TJ_AudioManager.instance.playAudio(this.currentRole.name);
        this.activeRoles.push(this.currentRole.name);
        this.scheduleOnce(() => {
            this.r.active = false;
            this.currentCards.forEach(card => {
                card.removeAllChildren();
            });
            this.cardMap.clear();
            this.propMap.clear();
            this.props = [];
            this.round++;
            this.mask.active = false;

            if (this.round >= this.allRoles.length) {
                this.gamePanel.Win();
            } else {
                this.init()
            }
        }, time)
    }

    fail() {
        console.log("错误")
        TJ_AudioManager.instance.playFail();
        this.f.active = true;
        this.failNumber--;
        this.title.string = `错误次数：${this.failNumber} / 10`
        this.scheduleOnce(() => {
            this.f.active = false;
            if (this.failNumber <= 0) {
                this.gamePanel.Lost();
            }
        }, 1)
    }
}