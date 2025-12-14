import { _decorator, Animation, AudioClip, BoxCollider2D, Color, Component, instantiate, Node, Prefab, Sprite, v2, Vec2 } from 'cc';
import { HLX_Item } from './HLX_Item';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { HLX_Touch } from './HLX_Touch';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('HLX_GameManager')
export class HLX_GameManager extends Component {
    public static instance: HLX_GameManager = null;

    @property(Prefab) item: Prefab = null;
    @property(Node) gameArea: Node = null;
    @property(Node) mask: Node = null;
    @property(Node) aniBG: Node = null;
    @property(Prefab) answer: Prefab = null;
    @property(Animation) ani: Animation = null;

    @property([AudioClip]) audios: AudioClip[] = [];

    strData: string[][] = [
        ["你", "抚", "琵", "琶", "奏", "琴", "弦"],
        ["白", "发", "听", "间", "前", "台", "我"],
        ["容", "动", "终", "心", "递", "楼", "坐"],
        ["颜", "浮", "戏", "百", "话", "子", "戏"],
        ["如", "风", "清", "年", "情", "将", "怎"],
        ["花", "赞", "几", "笑", "人", "甜", "怎"],
        ["挥", "舞", "芊", "芊", "玉", "手", "让"],
        ["你", "望", "于", "停", "美", "中", "画"],
        ["那", "日", "纸", "间", "马", "坐", "我"],
        ["离", "我", "离", "走", "车", "饮", "尽"],
        ["京", "赶", "走", "未", "见", "你", "愁"],
        ["敢", "回", "头", "终", "眸", "回", "愁"],
        ["不", "你", "念", "是", "想", "酒", "烈"],
    ]

    answerList: String[] = [
        "你抚琵琶奏琴弦",
        "我坐戏子楼台前",
        "怎将情话递心间",
        "白发听终戏百年",
        "清风浮动容颜",
        "如花赞几笑人甜",
        "怎让画中美停于纸间",
        "那日我离京赶走未见你回眸",
        "望你挥舞芊芊玉手",
        "我坐马车饮尽愁愁烈酒",
        "终是念你不敢回头"
    ];

    str: string = "";

    // list: string[] = [];

    nodes: Node[] = [];
    // allNodes: Node[] = [];

    count: number = 0;

    protected onLoad(): void {
        HLX_GameManager.instance = this;
    }

    start(): void {
        GamePanel.Instance.answerPrefab = this.answer;
        this.initData();
    }

    initData() {
        for (let i = 0; i < this.strData.length; i++) {
            for (let j = 0; j < this.strData[i].length; j++) {
                const item = instantiate(this.item).getComponent(HLX_Item).init(this.strData[i][j], v2(i, j));
                this.gameArea.addChild(item);
            }
        }
    }

    GetRandomColor(): Color {
        const red = Tools.GetRandomIntWithMax(0, 255);
        const green = Tools.GetRandomIntWithMax(0, 255);
        const blue = Tools.GetRandomIntWithMax(0, 255);
        const newColor = new Color(red, green, blue);
        return newColor;
    }

    check() {

        // 拼凑所有节点name
        this.nodes.forEach(n => {
            this.str += n.name;
        });

        let isCorrect = false;

        // 检查 str 是否在 answerList 中
        for (let i = 0; i < this.answerList.length; i++) {
            if (this.answerList[i] === this.str) {
                isCorrect = true;
                break;
            }
        }

        if (isCorrect) {
            console.log("正确");
            this.mask.active = true;
            this.aniBG.active = true;
            this.nodes.forEach(node => {
                node.getComponent(BoxCollider2D).enabled = false;
            });

            this.ani.node.active = true;
            const clips = this.ani.clips;
            if (this.str == "你抚琵琶奏琴弦") {
                this.ani.play("2");
            } else {
                this.ani.play(clips[Tools.GetRandomInt(0, clips.length)].name);
            }

            const time = this.playAudio(this.str);
            this.scheduleOnce(() => {
                this.aniBG.active = false;
                this.ani.node.active = false;
                this.mask.active = false;
                this.count++;
                if (this.count >= this.answerList.length) {
                    GamePanel.Instance.winStr = "成份拉满了";
                    GamePanel.Instance.Win();
                }
            }, time)
        }

        else {
            console.log("错误");
            this.nodes.forEach(node => {
                const sprite = node.getComponent(Sprite);
                if (sprite) {
                    sprite.color = Color.WHITE;
                }
            });
        }

        this.str = "";
        this.nodes = [];
    }

    playAudio(str: string): number {
        const audio = this.audios.find(audio => audio.name == str)
        if (audio) {
            AudioManager.Instance.PlaySFX(audio);
            return audio.getDuration();
        } else {
            console.log("没有找到音频：", str)
        }
    }
}


