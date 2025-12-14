import { _decorator, absMax, Component, find, Node, sp, tween, UITransform, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { MGRKT_AudioManager } from './MGRKT_AudioManager';
import { MGRKT_ButtonCtrl } from './MGRKT_ButtonCtrl';
const { ccclass, property } = _decorator;

@ccclass('MGRKT_EnemyCtrl')
export class MGRKT_EnemyCtrl extends Component {
    public static instance: MGRKT_EnemyCtrl = null;

    @property(Node) KBQN: Node = null;
    @property(Node) EY: Node = null;
    @property(Node) SY: Node = null;
    @property(Node) NC: Node = null;
    @property(Node) SR: Node = null;
    @property(Node) JZ: Node = null;
    @property(Node) QW: Node = null;
    @property(Node) DX: Node = null;

    private KBQNSke: sp.Skeleton = null;
    private EYSke: sp.Skeleton = null;
    private SYSke: sp.Skeleton = null;
    private NCSke: sp.Skeleton = null;
    private SRSke: sp.Skeleton = null;
    private JZSke: sp.Skeleton = null;
    private QWSke: sp.Skeleton = null;
    private DXSke: sp.Skeleton = null;

    enemyInitialPos: Vec3 = null;
    enemy: Node = null;
    enemys: Node[] = [];

    private posMap: Map<string, Vec3> = new Map([
        ["卡布奇诺", v3(250, 200, 0)],
        ["鳄鱼", v3(-150, 500, 0)],
        ["鲨鱼", v3(-100, 400, 0)],
        ["奶茶", v3(-100, 400, 0)],
        ["树人", v3(0, 400, 0)],
        ["橘子", v3(-200, 400, 0)],
        ["青蛙", v3(70, 600, 0)],
        ["大象", v3(0, 400, 0)],
    ]);

    protected onLoad(): void {
        MGRKT_EnemyCtrl.instance = this;
        this.enemys = this.node.children;

        this.KBQNSke = this.KBQN.getComponent(sp.Skeleton);
        this.EYSke = this.EY.getComponent(sp.Skeleton);
        this.SYSke = this.SY.getComponent(sp.Skeleton);
        this.NCSke = this.NC.getComponent(sp.Skeleton);
        this.SRSke = this.SR.getComponent(sp.Skeleton);
        this.JZSke = this.JZ.getComponent(sp.Skeleton);
        this.QWSke = this.QW.getComponent(sp.Skeleton);
        this.DXSke = this.DX.getComponent(sp.Skeleton);

        {
            this.activeSlotByEnemy(this.KBQNSke, "st", 0)
            this.activeSlotByEnemy(this.KBQNSke, "脸红", 0)
            this.activeSlotByEnemy(this.KBQNSke, "身体", 1)
            this.activeSlotByEnemy(this.KBQNSke, "云", 1)

            this.activeSlotByEnemy(this.EYSke, "变色", 0)
            this.activeSlotByEnemy(this.EYSke, "口香糖", 0)
            this.activeSlotByEnemy(this.EYSke, "油漆", 0)
            this.activeSlotByEnemy(this.EYSke, "身体", 1)

            this.activeSlotByEnemy(this.SYSke, "油漆", 0)
        }
    }

    protected start(): void {
        this.loadEnemy()
    }

    loadEnemy() {
        if (this.enemy) {
            this.enemys = this.enemys.filter(x => x != this.enemy)
        }
        const index = Tools.GetRandomInt(0, this.enemys.length)
        const enemy = this.enemys[index]
        console.log(enemy.name)
        this.enemyInitialPos = enemy.getPosition()
        this.enemy = enemy;
        const pos = this.posMap.get(enemy.name)

        tween(this.enemy)
            .to(0.5, { position: pos })
            .call(() => {
                const time = MGRKT_AudioManager.instance.playAudio(enemy.name)
                this.scheduleOnce(() => {
                    MGRKT_ButtonCtrl.instance.activeButton(enemy.name)
                }, time)
            })
            .start()
    }

    /**
     * 加载动画和皮肤 
     */
    loadSkinOrAniByRole(str: string) {
        switch (str) {
            case "情书":
                this.activeSlotByEnemy(this.KBQNSke, "脸红", 1);
                break;
            case "炸鸡":
                this.activeSlotByEnemy(this.KBQNSke, "st", 1);
                break;
            case "泡泡糖":
                this.activeSlotByEnemy(this.EYSke, "变色", 1);
                this.activeSlotByEnemy(this.EYSke, "口香糖", 1);
                this.activeSlotByEnemy(this.EYSke, "油漆", 1);
                break;
            case "颜料盘":
                this.activeSlotByEnemy(this.SYSke, "油漆", 1);
                break;
            case "西瓜":
                this.setSkinToEnemy(this.NCSke, "xg");
                this.updateAniByEnemy(this.NCSke, "xg", false);
                break;
            case "加特林":
                this.setSkinToEnemy(this.NCSke, "q");
                this.updateAniByEnemy(this.NCSke, "q", false);
                this.activeSlotByEnemy(this.NCSke, "惊恐", 1);
                this.activeSlotByEnemy(this.NCSke, "弹孔", 1);
                break;
            case "锤子":
                this.setSkinToEnemy(this.SRSke, "cz");
                break;
            case "榨汁机":
                this.setSkinToEnemy(this.JZSke, "jk");
                break;
            case "打气筒":
                this.updateAniByEnemy(this.QWSke, "dqt", false);
                this.setSkinToEnemy(this.QWSke, "dqt");
                break;
            case "地钻":
                const d = find("Canvas/GameArea/d");
                d.active = true;
                this.scheduleOnce(() => {
                    tween(d)
                        .to(0.3, { position: v3(1000, d.position.y, 0) })
                        .call(() => {
                            d.active = false;
                        })
                        .start()
                }, 1)
                break;
        }
    }

    /**
     * 激活插槽
     */
    activeSlotByEnemy(ske: sp.Skeleton, name: string, a: number) {
        const slot = ske.findSlot(name)
        if (slot) {
            slot.color.a = a;
        } else {
            console.error(`ske 没有找到对应的插槽 ${name}`);
        }
    }

    /**
     * 更新enemy动画
     */
    updateAniByEnemy(ske: sp.Skeleton, name: string, loop?: boolean) {
        try {
            ske.setAnimation(0, name, loop ?? true);
        } catch (error) {
            console.error(`ske 没有找到对应的动画 ${name}`);
        }
    }

    /**
     * 设置皮肤
     */
    setSkinToEnemy(ske: sp.Skeleton, name: string) {
        try {
            ske.setSkin(name);
        } catch (error) {
            console.error(`ske 没有找到对应的皮肤 ${name}`);
        }
    }
}