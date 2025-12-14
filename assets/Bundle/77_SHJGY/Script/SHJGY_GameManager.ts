import { _decorator, CCFloat, Component, Event, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { SHJGY_AudioManager } from './SHJGY_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJGY_GameManager')
export class SHJGY_GameManager extends Component {
    public static instance: SHJGY_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) rz: Node = null;
    @property(Node) label: Node = null;
    @property(Node) word: Node = null;
    @property(Node) UI: Node = null;

    @property([Node]) roles: Node[] = [];

    @property(Node) momLabel: Node = null;
    @property(Node) mgrLabel: Node = null;
    @property(Node) dxLabel: Node = null;
    @property(Node) jzLabel: Node = null;
    @property(Node) mask: Node = null;

    @property(SpriteFrame) girlSF: SpriteFrame = null;
    @property(SpriteFrame) momSF: SpriteFrame = null;
    @property(SpriteFrame) mgSF: SpriteFrame = null;
    @property(SpriteFrame) dxSF: SpriteFrame = null;
    @property(SpriteFrame) JZSF: SpriteFrame = null;

    @property(SpriteFrame) kbqnjj: SpriteFrame = null;
    @property(SpriteFrame) mgrjj: SpriteFrame = null;

    @property(Prefab) answer: Prefab = null;

    private round: number = 0;
    private children: Node = null;
    private fdj: Node = null;
    private adult_mask: Node = null;
    private adult_Copy: Node = null;

    private map: Map<string, Vec3> = new Map([
        ["role1_adult", v3(-150, -187, 0)],
        ["role1_children", v3(150, -187, 0)],

        ["role2_adult", v3(-170, -245, 0)],
        ["role2_children", v3(105, -240, 0)],

        ["role3_adult", v3(-150, -187, 0)],
        ["role3_children", v3(150, -187, 0)],

        ["role4_adult", v3(-70, -170, 0)],
        ["role4_children", v3(250, -165, 0)],
    ]);

    count: number = 0;
    private nb: number = 0;

    protected onLoad(): void {
        SHJGY_GameManager.instance = this;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;

        this.word.active = true;
        this.bottomTween(this.rz);
        tween(this.rz).to(0.5, { position: v3(-270, -180) }).call(() => {
            this.rz.getChildByName("Label").active = true
            const time = SHJGY_AudioManager.instance.playAudio("start");
            this.scheduleOnce(() => {
                this.rz.getChildByName("Label").active = false;
                this.label.active = true;
                const ti = SHJGY_AudioManager.instance.playAudio("放心吧");
                this.scheduleOnce(() => {
                    this.label.active = false;
                    tween(this.rz).to(0.5, { position: v3(-1000, -180) }).call(() => {
                        this.word.active = false;
                        this.initRole();
                    }).start();
                }, ti);
            }, time);
        }).start();
    }

    initRole() {
        try {
            const role = this.roles[this.round];
            console.log(role);
            role.active = true;
            this.children = role.getChildByName("Children")
            this.adult_mask = role.getChildByName("Adult_Mask");
            this.fdj = role.getChildByName("Magnifier");
            this.adult_Copy = this.fdj.getChildByName("DisplayArea").getChildByName("Adult_Copy");

            const adultPos = this.map.get(`role${this.round + 1}_adult`)
            const childrenPos = this.map.get(`role${this.round + 1}_children`)

            this.bottomTween(this.adult_mask);
            this.bottomTween(this.children);
            this.bottomTween(this.adult_Copy);

            tween(this.adult_mask).to(1, { position: adultPos }).start();
            tween(this.children).to(1, { position: childrenPos }).start();
        } catch (error) {
            console.error(error);
        }
    }


    private isface: boolean = false;
    private iskbqn: boolean = false;
    private ismg: boolean = false;
    private isdx: boolean = false;
    private ishread: boolean = false;
    onButtonClick(event: Event) {
        console.log(event.target.name);

        switch (event.target.name) {
            case "Face":
                if (this.isface) return;
                this.mask.active = true;
                this.isface = true;
                this.children.getComponent(Sprite).spriteFrame = this.girlSF;
                this.momLabel.active = true;
                this.momLabel.getChildByName("String").getComponent(Label).string = "被我拉着上课去，不开心了";
                const time1 = SHJGY_AudioManager.instance.playAudio("被我拉着上课去，不开心了");
                this.scheduleOnce(() => {
                    this.momLabel.active = false;
                    this.mask.active = false;
                }, time1);
                break;

            case "Adult_Copy_kbqn":
                if (this.iskbqn) return;
                this.mask.active = true;
                this.iskbqn = true;
                this.adult_mask.getComponent(Sprite).spriteFrame = this.momSF;
                this.momLabel.active = true;
                this.momLabel.getChildByName("String").getComponent(Label).string = "我最近想换种穿衣风格";
                const time2 = SHJGY_AudioManager.instance.playAudio("我最近想换种穿衣风格");
                this.scheduleOnce(() => {
                    this.momLabel.active = false;
                    this.mask.active = false;
                }, time2);
                break;
            case "Adult_mg":
                if (this.ismg) return;
                this.mask.active = true;
                this.ismg = true;
                this.adult_mask.getComponent(Sprite).spriteFrame = this.mgSF;
                this.mgrLabel.active = true;
                this.mgrLabel.getChildByName("String").getComponent(Label).string = "之前的木棒坏了，临时用铁的替代一下";
                const time3 = SHJGY_AudioManager.instance.playAudio("之前的木棒坏了，临时用铁的替代一下");
                this.scheduleOnce(() => {
                    this.mgrLabel.active = false;
                    this.mask.active = false;
                }, time3);
                break;

            case "Adult_Copy_DX":
                if (this.isdx) return;
                this.mask.active = true;
                this.mgrLabel.active = true;
                this.isdx = true;
                this.adult_mask.getComponent(Sprite).spriteFrame = this.dxSF;
                this.dxLabel.active = true;
                this.dxLabel.getChildByName("String").getComponent(Label).string = "你看错了吧，黄瓜和仙人掌还是很像的";
                const time4 = SHJGY_AudioManager.instance.playAudio("你看错了吧，黄瓜和仙人掌还是很像的");
                this.scheduleOnce(() => {
                    this.dxLabel.active = false;
                    this.mask.active = false;
                }, time4);
                break;

            case "Hread":
                if (this.ishread) return;
                this.mask.active = true;
                this.mgrLabel.active = true;
                this.ishread = true;
                this.adult_mask.getComponent(Sprite).spriteFrame = this.JZSF;
                this.jzLabel.active = true;
                this.jzLabel.getChildByName("String").getComponent(Label).string = "我这最近身体不好，果肉都裂开了";
                const time5 = SHJGY_AudioManager.instance.playAudio("我这最近身体不好，果肉都裂开了");
                this.scheduleOnce(() => {
                    this.jzLabel.active = false;
                    this.mask.active = false;
                }, time5);
                break;
        }

        this.xx()
    }


    private speed: number = 3;
    private scaleGap: number = 0.01;
    private oriScale: Vec3 = v3();

    bottomTween(node: Node) {
        Tween.stopAllByTarget(node);
        this.oriScale.set(node.getScale());

        tween(node)
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .union().repeatForever().start();
    }

    next() {
        try {
            this.roles[this.round].destroy();
            this.round++;
            if (this.round >= 4) {
                this.word.active = true;
                if (this.nb >= 4) {
                    this.rz.active = true
                    tween(this.rz)
                        .to(0.5, { position: v3(-270, -180) })
                        .call(() => {
                            this.rz.getChildByName("Label").active = true
                            this.rz.getChildByName("Label").getChildByName("String").getComponent(Label).string = "干得不错，这个月给你发奖金"
                            const time = SHJGY_AudioManager.instance.playAudio("干得不错，这个月给你发奖金");
                            this.scheduleOnce(() => {
                                Tween.stopAll()
                                this.gamePanel.Win()
                            }, time)
                        }).start()
                }
                else {
                    this.rz.active = true
                    tween(this.rz)
                        .to(0.5, { position: v3(-270, -180) })
                        .call(() => {
                            this.rz.getChildByName("Label").active = true
                            this.rz.getChildByName("Label").getChildByName("String").getComponent(Label).string = "废物，有小孩被拐走了，你就等着赔钱吧"
                            const time = SHJGY_AudioManager.instance.playAudio("废物，有小孩被拐走了，你就等着赔钱吧");
                            this.scheduleOnce(() => {
                                Tween.stopAll()
                                this.gamePanel.Lost()
                            }, time)
                        }).start()
                }
            } else {
                this.initRole();
            }
        } catch (error) {
            console.log(error)
        }
    }

    pass() {
        this.mask.active = true;
        this.fdj.active = false;
        this.count = 0
        let node = null
        this.UI.active = false
        let time = 0
        if (this.round == 3) {
            this.nb++
            node = this.setLabel(this.jzLabel, "多谢，那我们先走了");
            time = SHJGY_AudioManager.instance.playAudio("多谢，那我们先走了");
        }
        this.scheduleOnce(() => {
            if (node) {
                node.active = false;
            }
            tween(this.adult_mask).to(1, { position: v3(1500, this.adult_mask.position.y) }).start();
            tween(this.children)
                .to(1, { position: v3(1500, this.children.position.y) })
                .call(() => {
                    this.mask.active = false;
                    this.next();
                })
                .start();
        }, time)
    }

    noPass() {
        this.mask.active = true;
        this.fdj.active = false;
        this.UI.active = false
        let node = null
        this.count = 0
        let time = 0
        if (this.round == 0) {
            this.nb++
            this.adult_mask.getComponent(Sprite).spriteFrame = this.kbqnjj;
            node = this.setLabel(this.momLabel, "破门卫，你有什么资格阻拦我们");
            time = SHJGY_AudioManager.instance.playAudio("破门卫，你有什么资格阻拦我们");
        }
        else if (this.round == 1) {
            this.nb++
            this.adult_mask.getComponent(Sprite).spriteFrame = this.mgrjj;
            node = this.setLabel(this.mgrLabel, "你这是什么意思，凭什么抓我");
            time = SHJGY_AudioManager.instance.playAudio("你这是什么意思，凭什么抓我");
        }
        else if (this.round == 2) {
            this.nb++
            node = this.setLabel(this.dxLabel, "有本事你出来，我一鼻子甩飞你");
            time = SHJGY_AudioManager.instance.playAudio("有本事你出来，我一鼻子甩飞你");
        }

        this.scheduleOnce(() => {
            if (node) {
                node.active = false;
            }
            tween(this.adult_mask).to(1, { position: v3(-1500, this.adult_mask.position.y) }).start();
            tween(this.children).to(1, { position: v3(-1500, this.children.position.y) })
                .call(() => {
                    this.mask.active = false;
                    this.next();
                }).start();
        }, time);
    }

    setLabel(node: Node, str: string) {
        node.active = true;
        node.getChildByName("String").getComponent(Label).string = str
        return node;
    }

    xx() {
        this.count++;
        console.log("SHJGY_GameManager.ts");
        if (this.count >= 2) {
            this.UI.active = true;
        }
    }

}


