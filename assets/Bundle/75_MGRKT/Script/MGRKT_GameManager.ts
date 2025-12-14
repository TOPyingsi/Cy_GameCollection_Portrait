import { _decorator, Component, Label, Node, Prefab, sp, Sprite, SpriteFrame, tween, v3 } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { MGRKT_EnemyCtrl } from './MGRKT_EnemyCtrl';
import { QC_TouchCtrl } from '../../78_HMMQC/Script/QC_TouchCtrl';
const { ccclass, property } = _decorator;

@ccclass('MGRKT_GameManager')
export class MGRKT_GameManager extends Component {

    public static instance: MGRKT_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) gameArea: Node = null;
    @property(Node) BG1: Node = null;
    @property(Node) BG2: Node = null;
    @property(Node) MGR: Node = null;
    @property(Node) Label: Node = null;
    @property(Label) jd: Label = null;
    @property([SpriteFrame]) props: SpriteFrame[] = [];
    @property(Prefab) prop: Prefab = null;
    @property(Prefab) answer: Prefab = null;

    private speed: number = 300;
    private bg1X: number = 0;
    private bg2X: number = 0;
    count: number = 0;
    mgrSke: sp.Skeleton = null;
    private map: Map<string, string> = new Map([
        ["加特林", "中弹了！"],
        ["颜料盘", "我刚买的宝贝新鞋就给我弄脏了"],
        ["锤子", "我的脚好痛"],
        ["地钻", "哪来的大洞"],
        ["榨汁机", "救命啊，你离我远一点啊"],
        ["泡泡糖", "什么东西挡住了我的视线…要坠机了"],
        ["打气筒", "放过我吧，我要炸了"],
        ["情书", "怎么这么突然，搞得人家好害羞啊"],
        ["穿云箭", "别在这丢人现眼了"],
        ["香蕉", "你人还怪好的，还给我加餐"],
        ["网", "我可是忍者，抓住真正的我你才能赢"],
        ["汽油", "汽油只会让我加速"],
        ["西瓜", "让我表演切西瓜吗"],
        ["高跟鞋", "穿上感觉跑得更快了"],
        ["卸妆水", "我的妆可是牢牢地扒在脸上的"],
        ["鱼钩", "你也太小看我了"],
        ["杠铃", "杠铃只会让我更强壮"],
        ["蛋白粉", "蛋白粉只会让我更强壮"],
        ["炸鸡", "都怪你，让我变得这么胖"],
        ["图钉", "以为这就能扎到我的脚吗"],
        ["石头", "这垫脚石也太小了吧"],
        ["抽水机", "没用的，我在陆地也能呼吸"],
        ["猎枪", "可惜了，我刀枪不入"],
        ["指甲刀", "小小指甲刀能奈我何"],
    ]);

    protected onLoad(): void {
        MGRKT_GameManager.instance = this;
        this.bg1X = this.BG1.position.x;
        this.bg2X = this.BG2.position.x;


        this.mgrSke = this.MGR.getComponent(sp.Skeleton);
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;

        this.jd.string = `${this.count} / 8`
    }

    protected update(deltaTime: number): void {
        let newX1 = this.BG1.position.x + this.speed * deltaTime;
        let newX2 = this.BG2.position.x + this.speed * deltaTime;
        this.BG1.setPosition(newX1, this.BG1.position.y);
        this.BG2.setPosition(newX2, this.BG2.position.y);

        if (newX1 >= 4163.486) {
            this.BG1.setPosition(v3(this.bg2X, 0, 0));
        } else if (newX2 >= 4163.486) {
            this.BG2.setPosition(v3(this.bg1X, 0, 0));
        }
    }

    setLabel(str: string) {
        this.Label.active = true
        this.Label.getChildByName("Label").getComponent(Label).string = this.map.get(str)
        return this.Label
    }

    next() {
        this.count++
        this.jd.string = `${this.count} / 8`
        if (this.count >= 8) {
            this.gamePanel.Win()
        } else {
            MGRKT_EnemyCtrl.instance.loadEnemy()
        }
    }

    loadProp(str: string, callBack?: Function) {
        console.log("loadProp", str)
        const sf = this.props.find(x => x.name == str)
        if (sf) {
            const node = NodeUtil.Instantiate(this.prop, this.gameArea)
            node.name = str;
            node.getComponent(Sprite).spriteFrame = sf
            node.setPosition(-350, 150)
            tween(node)
                .to(0.5, { position: v3(200, 150) })
                .call(() => {
                    node.destroy();
                    if (callBack) callBack(str);
                })
                .start()
        }
    }

}


