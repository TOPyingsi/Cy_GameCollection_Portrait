import { _decorator, AnimationComponent, AudioClip, AudioSource, Component, Label, Node, Prefab, tween, v3 } from 'cc';
import { YJDJ_TouchCtrl } from './YJDJ_TouchCtrl';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

export enum YJDJ_TalkStr {
    筋膜枪 = "筋膜枪可以促进脚的血液循环",
    缩骨功 = "可惜我练习时间太少，只能缩小一点了",
    针 = "没想到脚里的脂肪这么多",
    暖宝宝 = "热敷也可以帮我脚消肿一下",
    手机 = "还得是领导给穿的小鞋好使",
    冰袋 = "给脚降降温消消肿",
    蚊子 = "排除脚里的淤堵感觉脚轻了不少",
    窗帘 = "吃得苦中苦，才能得到一双小脚",
    木棍 = "虽然这正骨方式有点粗暴，但有效果啊",
}

@ccclass('YJDJ_GameMgr')
export class YJDJ_GameMgr extends Component {

    @property(Prefab)
    answerPrefab: Prefab = null;
    //判断flag
    public isDisinfect: boolean = false;//是否消毒
    public isIceBagShow: boolean = false;

    //缩骨功
    @property(Node)
    public suoguNode: Node = null;

    @property(Node)
    public FeetNode: Node = null;
    @property(Node)
    public player: Node = null;
    @property(Node)
    public propNode: Node = null;

    @property(Node)
    public manTalkWindow: Node = null;
    @property(Node)
    public talkWindow: Node = null;

    @property({ type: [AudioClip] })
    clips: AudioClip[] = [];

    public isGameOver: boolean = false;
    public isPass: boolean = false;
    public isTalk: boolean = true;

    public ani: AnimationComponent = null;
    public audio: AudioSource = null;

    public static instance: YJDJ_GameMgr = null;
    start() {
        YJDJ_GameMgr.instance = this;

        this.initData();
    }

    reduceNum: number = 0;
    //脚缩小
    ReduceFeet() {
        this.FeetNode.scale = this.FeetNode.scale.add(v3(-0.1, -0.1, -0.1));
        this.reduceNum++;
    }

    suogu() {
        let suoguTs = this.suoguNode.getComponent(YJDJ_TouchCtrl);
        suoguTs.couldMove = true;
    }

    playAni(aniName: string) {
        switch (aniName) {
            case "胜利":
                this.Win();
                break;
            case "消毒":
                this.ani.once(AnimationComponent.EventType.FINISHED, () => {
                    this.isDisinfect = true;
                    this.isTalk = false;
                }, this);
                break;
            case "椰子汁":
                this.scheduleOnce(() => {
                    this.Lost();
                }, 2);
                break;
            case "烂脚":
                this.playSFX(aniName);
                this.showTalk(this.talkWindow, "伤口感染了我的头好晕");

                this.scheduleOnce(() => {
                    this.isGameOver = true;
                    GamePanel.Instance.Lost();
                }, 3);
                break;

            case "射箭":
                this.ani.once(AnimationComponent.EventType.FINISHED, () => {
                    let suoguTs = this.suoguNode.getComponent(YJDJ_TouchCtrl);
                    this.isTalk = false;
                    suoguTs.couldMove = true;
                    suoguTs.initData();
                }, this);
                break;
            case "窗帘":
                this.playSFX(aniName);
                this.showTalk(this.talkWindow, YJDJ_TalkStr[aniName]);

                this.scheduleOnce(() => {

                    this.closeTalk(this.talkWindow);
                }, 3.5);

                this.scheduleOnce(this.ReduceFeet, 3);
                break;
            case "手机":
                this.scheduleOnce(() => {
                    this.playSFX(aniName);
                    this.showTalk(this.talkWindow, YJDJ_TalkStr[aniName]);

                    this.audio.node.once(AudioSource.EventType.ENDED, () => {
                        this.closeTalk(this.talkWindow);
                    }, this);
                }, 3.5);

                this.scheduleOnce(this.ReduceFeet, 3);
                break;
            case "碎鞋":
                this.scheduleOnce(this.Lost, 1);
                break;
            case "针":
            case "木棍":
            case "筋膜枪":
            case "缩骨功":
            case "蚊子":
            case "冰袋":
            case "暖宝宝":
                this.scheduleOnce(() => {
                    this.playSFX(aniName);

                    this.showTalk(this.talkWindow, YJDJ_TalkStr[aniName]);

                    this.audio.node.once(AudioSource.EventType.ENDED, () => {
                        this.closeTalk(this.talkWindow);
                    }, this);
                }, 2);
                this.scheduleOnce(this.ReduceFeet, 1.5);
                break;
        }

        this.ani.play(aniName);


        // TimerControl.Instance.AddIncident("瘦脚", () => {
        //     this.ReduceFeet();
        // }, 1.2, this.player);

    }

    /**
     * 
     * 显示对话框
        @param talkNode 对话框节点
        @param talkStr 对话内容
     */
    showTalk(talkNode: Node, talkStr: string) {
        let talkLabel = talkNode.getComponentInChildren(Label);

        talkLabel.string = talkStr;

        tween(talkNode)
            .to(0.5, { scale: v3(1, 1, 1) })
            .start();
    }

    isFirst: boolean = true;
    closeTalk(talkNode: Node) {
        tween(talkNode)
            .to(0.2, { scale: v3(0, 0, 0) })
            .call(() => {
                if (this.isFirst) {
                    this.isFirst = false;
                    return;
                }
                this.isTalk = false;
            })
            .start();
    }

    stopHit() {
        let bg = this.node.getChildByName("背景");
        let bgAni = bg.getComponent(AnimationComponent);
        bgAni.stop();

        let hit = bg.getChildByName("撞击1");
        hit.active = false;

        let man = bg.getChildByName("男主");
        man.active = false;

    }

    Win() {
        this.isGameOver = true;

        this.stopHit();

        this.playSFX("胜利");

        this.scheduleOnce(() => {
            this.playSFX("算你识相");
        }, 3.2);

        this.scheduleOnce(() => {
            GamePanel.Instance.Win();
        }, 4.5);
    }

    Lost() {
        this.isGameOver = true;

        this.showTalk(this.manTalkWindow, "雨姐,你这个大脚太带派了,我承受不了");
        let bg = this.node.getChildByName("背景");

        let manDefeat = bg.getChildByName("男主失败");
        let door = bg.getChildByName("门");
        let doorClose = bg.getChildByName("门板");

        manDefeat.active = true;
        door.active = true;
        doorClose.active = false;

        this.stopHit();

        this.playSFX("失败");

        this.scheduleOnce(() => {
            this.closeTalk(this.manTalkWindow);

            tween(manDefeat)
                .by(1, { position: v3(-300, 0, 0) })
                .start();
        }, 3);

        this.scheduleOnce(() => {
            let cry = this.player.getChildByName("哭脸");
            cry.active = true;

            this.showTalk(this.talkWindow, "完蛋了，我的爱情啊");
            this.playSFX("完蛋了我的爱情啊");

        }, 5);

        this.scheduleOnce(() => {
            GamePanel.Instance.Lost();
        }, 7);

    }

    playMgrSFX(clipName: string) {
        for (let clip of this.clips) {
            if (clip.name === clipName) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }

    playSFX(clipName: string) {
        if (AudioManager.IsSoundOn) {
            this.audio.volume = 1;
        }
        else {
            this.audio.volume = 0;
        }

        this.isTalk = true;

        for (let clip of this.clips) {
            if (clip.name === clipName) {
                this.audio.clip = clip;
                this.audio.play();
            }
        }

    }


    startAni() {
        let man = this.node.getChildByName("背景").getChildByName("男主");
        tween(man)
            .to(1, { position: v3(-424.38, -825.706, 0) })
            .call(() => {
                this.playSFX("敲门");
                this.showTalk(this.manTalkWindow, "雨姐姐，快开门啊，你的小奶狗来赴约了");

                this.scheduleOnce(() => {

                    let ani = this.node.getChildByName("背景").getComponent(AnimationComponent);
                    ani.play("敲门");
                }, 4);

            })
            .start();
        //开场
        this.scheduleOnce(() => {
            this.closeTalk(this.manTalkWindow);
            this.showTalk(this.talkWindow, "不好，他怎么来这么快，我的脚被蜜蜂叮大还没变小呢，我该怎么办");
            this.playSFX("雨姐开头");
        }, 5.5);

        this.scheduleOnce(() => {
            this.closeTalk(this.talkWindow);

            this.isTalk = false;
        }, 10.5);
    }
    initData() {

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        this.ani = this.getComponent(AnimationComponent);
        this.audio = this.getComponent(AudioSource);
        this.startAni();
    }





}


