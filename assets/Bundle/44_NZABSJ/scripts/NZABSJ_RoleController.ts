import { _decorator, Component, Node, EventTouch, Vec3, tween, Vec2, Label, AudioClip, Skeleton, sp, UIOpacity, Prefab, instantiate } from 'cc';
import { NZABSJ_GameMain } from './NZABSJ_GameMain';
import { NZABSJ_PropController } from './NZABSJ_PropController';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NZABSJ_RoleController')
export class NZABSJ_RoleController extends Component {

    private static instance: NZABSJ_RoleController = null;

    public static get Instance(): NZABSJ_RoleController {
        return this.instance;
    }

    @property(Node)
    nezha: Node = null;

    @property(Node)
    aobing: Node = null;

    @property([AudioClip])
    audios: AudioClip[] = [];

    @property([Node])
    tx1: Node[] = []

    @property([Node])
    tx2: Node[] = []

    @property(Prefab)
    leftLabel: Prefab;

    @property(Prefab)
    rightLabel: Prefab;

    @property(Node)
    labelParentNode: Node = null;

    private touchStartPos: Vec2 = null;

    nezhaske: sp.Skeleton = null
    aobingske: sp.Skeleton = null;

    isFlip: boolean = false;

    scount: number = 0;

    /**
     * false 哪吒在左 敖丙在右
     * true 敖丙在左 哪吒在右
     */
    islr: boolean = false;

    sCount: number = 0;
    eCount: number = 0;

    protected onLoad(): void {

        this.nezhaske = this.nezha.getComponent(sp.Skeleton);
        this.aobingske = this.aobing.getComponent(sp.Skeleton);
        NZABSJ_RoleController.instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        {
            this.setNeZhaSke("冰锤", 0);
            this.setNeZhaSke("正常", 1);
            this.setNeZhaSke("正确", 0);
            this.setNeZhaSke("莲花裙", 0);
            this.setNeZhaSke("袜子", 0);
            this.setNeZhaSke("错误", 0);
            this.setNeZhaSke("长裤", 1);
            this.setNeZhaSke("龙角", 0);
        }
        {
            this.setAoBingSke("正常", 1);
            this.setAoBingSke("正确", 0);
            this.setAoBingSke("火尖枪", 0);
            this.setAoBingSke("短裤", 1);
            this.setAoBingSke("莲花裙", 0);
            this.setAoBingSke("袜子", 0);
            this.setAoBingSke("错误", 0);
            this.setAoBingSke("颤抖", 1);
            this.setAoBingSke("龙角", 0);
        }
    }

    setNeZhaSke(name: string, a: number) {
        this.nezhaske.findSlot(name).color.a = a;
    }
    setAoBingSke(name: string, a: number) {
        this.aobingske.findSlot(name).color.a = a;
    }


    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {
        this.touchStartPos = event.getLocation();
    }

    private onTouchEnd(event: EventTouch): void {
        if (this.isFlip) return;
        const touchEndPos = event.getLocation();
        const deltaX = touchEndPos.x - this.touchStartPos.x;

        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // 右滑
                this.swapRoles(true);
            } else {
                // 左滑
                this.swapRoles(false);
            }
        }
    }

    private swapRoles(isRightSwipe: boolean): void {
        if (!this.nezha || !this.aobing) return;

        this.islr = !this.islr;

        const nezhaPos = this.nezha.position;
        const aobingPos = this.aobing.position;

        const nezhaScale = this.nezha.scale;
        const aobingScale = this.aobing.scale;

        const targetNezhaScale = new Vec3(-nezhaScale.x, nezhaScale.y, nezhaScale.z);
        const targetAobingScale = new Vec3(-aobingScale.x, aobingScale.y, aobingScale.z);

        tween(this.nezha)
            .to(0.1, { position: aobingPos })
            .call(() => {
                this.nezha.setScale(targetNezhaScale);
            })
            .start();

        tween(this.aobing)
            .to(0.1, { position: nezhaPos })
            .call(() => {
                this.aobing.setScale(targetAobingScale);
            })
            .start();
    }

    s() {
        this.isFlip = true;
        this.sCount++;
        switch (NZABSJ_GameMain.Instance.round) {
            case 0:
                this.x("冲个澡清爽许多", "运功护体暖和点了", true, "正确", "正确", "win", "win");
                this.loadTX1("LinYu");
                break;
            case 1:
                this.x("师傅的法宝真的挺多的", "三昧真火烧不死我兄弟也烧不死我", true, "正确", "正确", "win", "win");
                break;
            case 2:
                this.x("凉快多了", "脚暖全身都暖了", true, "莲花裙", "袜子", "win", "win");
                break;
            case 3:
                this.x("丙丙的龙角全是寒气", "这童子仙露功效就是多", true, "龙角", "正确", "win", "win");
                break;
            case 4:
                this.x("透心凉心飞扬", "睡前喝一杯全身暖洋洋", true, "正确", "正确", "win", "win");
                this.loadTX1("Coke");
                this.loadTX2("RedBeer");
                break;
            case 5:
                this.x("18度才是最舒服的温度", "这小太阳烤的全身都暖了", true, "正确", "正确", "win", "win");
                this.loadTX1("AirConditioner");
                break;
            case 6:
                this.x("丙丙的大冰锤好凉爽", "感觉全身都燃起来了", true, "冰锤", "火尖枪", "win", "win");
                break;
        }
    }

    e() {
        this.isFlip = true;
        this.eCount++;
        switch (NZABSJ_GameMain.Instance.round) {
            case 0:
                this.x("热的要爆炸了", "冻死龙了", false, "错误", "错误", "lose", "lose");
                this.loadTX2("LinYu");
                this.loadTX1("Fire");
                break;
            case 1:
                this.x("热的要爆炸了", "冻死龙了", false, "错误", "错误", "lose", "lose");
                this.loadTX1("Fire");
                break;
            case 2:
                this.x("脚又闷又臭", "冷得我膝盖疼", false, "袜子", "莲花裙", "lose", "lose");
                break;
            case 3:
                this.x("热的要爆炸了", "龙角的寒气都渗透到身体里了", false, "错误", "龙角", "lose", "lose");
                this.loadTX1("Fire");
                break;
            case 4:
                this.x("一杯酒下肚更热烈", "太冷了受不了了", false, "错误", "错误", "lose", "lose");
                this.loadTX1("RedBeer");
                this.loadTX2("Coke");
                break;
            case 5:
                this.x("热的要爆炸了", "这怎么比在龙宫还要冷", false, "错误", "错误", "lose", "lose");
                this.loadTX1("Fire");
                this.loadTX2("AirConditioner");
                break;
            case 6:
                this.x("热的要爆炸了", "拿上冰锤更冷了", false, "火尖枪", "冰锤", "lose", "lose");
                this.loadTX1("Fire");
                break;
        }
    }

    loadTX1(name: string) {
        this.tx1.forEach(item => {
            if (item.name == name) {
                item.active = true;

                this.scheduleOnce(() => {
                    item.active = false;
                }, 2);
            }
        });
    }

    loadTX2(name: string) {
        this.tx2.forEach(item => {
            if (item.name == name) {
                item.active = true;

                this.scheduleOnce(() => {
                    item.active = false;
                }, 2);
            }
        });
    }


    setLeftLabel(str: string): Node {
        const label = instantiate(this.leftLabel);
        label.getChildByName("Label").getComponent(Label).string = str;
        label.setParent(this.labelParentNode);
        return label;
    }

    setRightLabel(str: string): Node {
        const label = instantiate(this.rightLabel);
        label.getChildByName("Label").getComponent(Label).string = str;
        label.setParent(this.labelParentNode);
        return label;
    }

    /**
     * 
     * @param str1 哪吒的对话文本
     * @param str2 敖丙的对话文本
     * @param isWin true正确 false错误
     * @param ske1 哪吒皮肤
     * @param ske2 敖丙皮肤
     * @param ani1 哪吒动画
     * @param ani2 敖丙动画
     */
    x(nazhalabel: string, aobinglabel: string, isWin: boolean, ske1: string, ske2: string, ani1: string, ani2: string) {
        if (isWin) {
            let bg1: Node;
            let bg2: Node;
            if (this.islr) {// false 哪吒在左 敖丙在右 true 敖丙在左 哪吒在右
                bg1 = this.setLeftLabel(aobinglabel);
                bg2 = this.setRightLabel(nazhalabel);
            } else {
                bg1 = this.setLeftLabel(nazhalabel);
                bg2 = this.setRightLabel(aobinglabel);
            }
            bg1.active = true;
            if (this.islr) {
                console.log("222");

                this.playAudio(aobinglabel);
            } else {
                this.playAudio(nazhalabel);
            }
            // this.playAudio(str1);

            if (ske1 == "正确" && ske2 == "正确") {
                this.zq(ske1, ske2, ani1, ani2);
            } else if (ske1 == "莲花裙" && ske2 == "袜子") {
                this.lhqAndWz();
            } else if (ske1 == "龙角") {
                this.lj();
            } else if (ske1 == "冰锤" && ske2 == "火尖枪") {
                this.bcAndHjq()
            }

            this.scheduleOnce(() => {
                bg1.active = false;
                bg2.active = true;
                if (this.islr) {
                    console.log("111");
                    this.playAudio(nazhalabel);
                } else {
                    this.playAudio(aobinglabel);
                }
                // this.playAudio(str2);

                this.scheduleOnce(() => {
                    bg2.active = false;

                    if (ske1 == "正确" && ske2 == "正确") {
                        this.rezq(ske1, ske2);
                    } else if (ske1 == "莲花裙" && ske2 == "袜子") {
                        this.relhqAndWz();
                    } else if (ske1 == "龙角") {
                        this.relj();
                    } else if (ske1 == "冰锤" && ske2 == "火尖枪") {
                        this.rebcAndHjq();
                    }
                    this.scheduleOnce(() => {
                        this.isFlip = false;
                        NZABSJ_GameMain.Instance.loadProgress();

                    }, 2);
                }, 2);
            }, 2);

        } else if (!isWin) {
            let bg1: Node;
            let bg2: Node;
            if (this.islr) {// false 哪吒在左 敖丙在右 true 敖丙在左 哪吒在右
                bg1 = this.setLeftLabel(aobinglabel);
                bg2 = this.setRightLabel(nazhalabel);
            } else {
                bg1 = this.setLeftLabel(nazhalabel);
                bg2 = this.setRightLabel(aobinglabel);
            }
            bg1.active = true;
            if (this.islr) {
                this.playAudio(aobinglabel);
            } else {
                this.playAudio(nazhalabel);
            }

            if (ske1 == "错误" && ske2 == "错误") {
                this.zq(ske1, ske2, ani1, ani2);
            } else if (ske1 == "袜子" && ske2 == "莲花裙") {
                this.wzAndLhq();
            } else if (ske2 == "龙角") {
                this.lj2();
            } else if (ske1 == "冰锤" && ske2 == "火尖枪") {
            }


            this.scheduleOnce(() => {
                bg1.active = false;
                bg2.active = true;
                if (this.islr) {

                    this.playAudio(nazhalabel);
                } else {
                    this.playAudio(aobinglabel);
                }
                this.scheduleOnce(() => {
                    bg2.active = false;
                    if (ske1 == "错误" && ske2 == "错误") {
                        this.rezq(ske1, ske2);
                    } else if (ske1 == "袜子" && ske2 == "莲花裙") {
                        this.reWzAndLhq();
                    } else if (ske2 == "龙角") {
                        this.relj2();
                    } else if (ske1 == "冰锤" && ske2 == "火尖枪") {
                    }
                    this.scheduleOnce(() => {
                        this.isFlip = false;
                        NZABSJ_GameMain.Instance.loadProgress();

                    }, 2);
                }, 2);
            }, 2);

        }

    }

    playAudio(name: string) {
        console.log("播放" + name);
        this.audios.forEach(item => {
            if (item.name == name) {
                AudioManager.Instance.PlaySFX(item);
            }
        });
    }

    zq(ske1: string, ske2: string, ani1: string, ani2: string) {
        this.setNeZhaSke(ske1, 1);
        this.setAoBingSke(ske2, 1);
        this.setAoBingSke("颤抖", 0);
        this.nezhaske.setAnimation(1, ani1, true);
        this.aobingske.setAnimation(1, ani2, true);
    }

    rezq(ske1: string, ske2: string) {
        this.setNeZhaSke(ske1, 0);
        this.setAoBingSke(ske2, 0);
        this.setAoBingSke("颤抖", 1);
        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }

    lhqAndWz() {
        this.setNeZhaSke("长裤", 0);
        this.setNeZhaSke("莲花裙", 1);
        this.setAoBingSke("袜子", 1);
        this.setNeZhaSke("正确", 1);
        this.setAoBingSke("正确", 1);
        this.setAoBingSke("颤抖", 0);
        this.nezhaske.setAnimation(1, "win", true);
        this.aobingske.setAnimation(1, "win", true);
    }

    relhqAndWz() {
        this.setNeZhaSke("正确", 1);
        this.setAoBingSke("正确", 1);
        this.setAoBingSke("颤抖", 1);
        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }

    lj() {
        this.setNeZhaSke("龙角", 1);
        this.setNeZhaSke("正确", 1);
        this.setAoBingSke("正确", 1);
        this.setAoBingSke("颤抖", 0);
        this.nezhaske.setAnimation(1, "win", true);
        this.aobingske.setAnimation(1, "win", true);
    }

    relj() {
        this.setNeZhaSke("正确", 0);
        this.setAoBingSke("正确", 0);
        this.setAoBingSke("颤抖", 1);

        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }

    bcAndHjq() {
        this.setNeZhaSke("冰锤", 1);
        this.setAoBingSke("火尖枪", 1);
        this.setNeZhaSke("正确", 1);
        this.setAoBingSke("正确", 1);
        this.setAoBingSke("颤抖", 0);
        this.nezhaske.setAnimation(1, "win", true);
        this.aobingske.setAnimation(1, "win", true);
    }

    rebcAndHjq() {
        this.setNeZhaSke("正确", 0);
        this.setAoBingSke("正确", 0);
        this.setAoBingSke("颤抖", 1);
        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }

    cw() {
        this.setNeZhaSke("错误", 1);
        this.setAoBingSke("错误", 1);
        this.nezhaske.setAnimation(1, "lose", true);
        this.aobingske.setAnimation(1, "lose", true);
    }

    recw() {
        this.setNeZhaSke("错误", 0);
        this.setAoBingSke("错误", 0);
        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }

    wzAndLhq() {
        this.setNeZhaSke("错误", 1);
        this.setAoBingSke("错误", 1);
        this.setNeZhaSke("袜子", 1);
        this.setAoBingSke("莲花裙", 1);
        this.nezhaske.setAnimation(1, "lose", true);
        this.aobingske.setAnimation(1, "lose", true);
    }

    reWzAndLhq() {
        this.setNeZhaSke("错误", 0);
        this.setAoBingSke("错误", 0);
        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }

    lj2() {
        this.setAoBingSke("龙角", 1);
        this.setNeZhaSke("错误", 1);
        this.setAoBingSke("错误", 1);
        this.nezhaske.setAnimation(1, "lose", true);
        this.aobingske.setAnimation(1, "lose", true);
    }

    relj2() {
        this.setNeZhaSke("错误", 0);
        this.setAoBingSke("错误", 0);
        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }

    hjqAndBc() {
        this.setNeZhaSke("火尖枪", 1);
        this.setAoBingSke("冰锤", 1);
        this.setNeZhaSke("错误", 1);
        this.setAoBingSke("错误", 1);
        this.nezhaske.setAnimation(1, "lose", true);
        this.aobingske.setAnimation(1, "lose", true);
    }

    rehjqAndBc() {
        this.setNeZhaSke("错误", 0);
        this.setAoBingSke("错误", 0);
        this.nezhaske.setAnimation(1, "normal", true);
        this.aobingske.setAnimation(1, "normal", true);
    }
}