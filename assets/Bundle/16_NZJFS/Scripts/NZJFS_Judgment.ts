import { _decorator, Component, Label, Node, Prefab, Event, instantiate, find, tween, size, v2, v3, UIOpacity, UITransform, Sprite, AudioClip, AudioSource, director } from 'cc';
import { NZJFS_GameManager } from './NZJFS_GameManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('NZJFS_Judgment')
export class NZJFS_Judgment extends Component {
    @property(Node)
    Tips: Node = null;
    @property(Node)
    Tips1: Node = null;
    @property(Node)
    Tips2: Node = null;
    @property({ type: [AudioClip] })
    YingYue: Array<AudioClip> = [];
    @property(GamePanel) gamePanel: GamePanel = null;
    protected onLoad(): void {

    }

    TipsLabelChange() {
        NZJFS_GameManager.Instance.TipsActive();
        if (NZJFS_GameManager.Instance.GameLevel == 0) {
            this.Tips.children[0].getComponent(Label).string = "天欲灭我我灭天";//
            this.Tips1.children[0].getComponent(Label).string = "小爷吃肉不放盐";//
            this.Tips2.children[0].getComponent(Label).string = "小爷成魔不成仙";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "我命由我不由天";
            this.YingYue.forEach((music) => {
                let strs = "我命由我不由天";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                    //this.node.getComponent(AudioSource).play();

                }
            })
        }
        if (NZJFS_GameManager.Instance.GameLevel == 1) {
            this.Tips.children[0].getComponent(Label).string = "专和老天对着干";//
            this.Tips1.children[0].getComponent(Label).string = "不服咱们就是干";//
            this.Tips2.children[0].getComponent(Label).string = "不服咱就对着干";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "从来生死都看淡";

            this.YingYue.forEach((music) => {
                let strs = "从来生死都看淡";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                }
            })

        }
        if (NZJFS_GameManager.Instance.GameLevel == 2) {
            this.Tips.children[0].getComponent(Label).string = "能踢毽子会做诗";//
            this.Tips1.children[0].getComponent(Label).string = "能降妖来会做诗";//
            this.Tips2.children[0].getComponent(Label).string = "能踢毽子会降妖";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "我乃哪吒三太子";

            this.YingYue.forEach((music) => {
                let strs = "我乃哪吒三太子";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                }
            })

        }
        if (NZJFS_GameManager.Instance.GameLevel == 3) {
            this.Tips.children[0].getComponent(Label).string = "是一座大山";//
            this.Tips1.children[0].getComponent(Label).string = "是一座大桥";//
            this.Tips2.children[0].getComponent(Label).string = "是一条河";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "人心中的成见";

            this.YingYue.forEach((music) => {
                let strs = "人心中的成见";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                }
            })

        }
        if (NZJFS_GameManager.Instance.GameLevel == 4) {
            this.Tips.children[0].getComponent(Label).string = "躲在被窝里想尿尿";//
            this.Tips1.children[0].getComponent(Label).string = "突破天劫我笑哈哈";//
            this.Tips2.children[0].getComponent(Label).string = "劈的我浑身掉渣渣";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "天雷滚滚我好怕怕";

            this.YingYue.forEach((music) => {
                let strs = "天雷滚滚我好怕怕";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                }
            })

        }
        if (NZJFS_GameManager.Instance.GameLevel == 5) {
            this.Tips.children[0].getComponent(Label).string = "不知天高地厚";//
            this.Tips1.children[0].getComponent(Label).string = "我们还有大把的时间";//
            this.Tips2.children[0].getComponent(Label).string = "什么都无所谓";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "因为我们都还年轻";

            this.YingYue.forEach((music) => {
                let strs = "因为我们都还年轻";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                }
            })

        }
        if (NZJFS_GameManager.Instance.GameLevel == 6) {
            this.Tips.children[0].getComponent(Label).string = "逆天而行是无奈";//
            this.Tips1.children[0].getComponent(Label).string = "斩妖除魔我最擅长";//
            this.Tips2.children[0].getComponent(Label).string = "为民除害我最擅长";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "替天行道是使命";

            this.YingYue.forEach((music) => {
                let strs = "替天行道是使命";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                }
            })

        }
        if (NZJFS_GameManager.Instance.GameLevel == 7) {
            this.Tips.children[0].getComponent(Label).string = "我只要你死";//
            this.Tips1.children[0].getComponent(Label).string = "能吃饱就行";//
            this.Tips2.children[0].getComponent(Label).string = "我只要你活";//
            find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "我活不活无所谓";

            this.YingYue.forEach((music) => {
                let strs = "我活不活无所谓";
                if (strs == music.name) {
                    this.node.getComponent(AudioSource).clip = music;
                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                }
            })
        }
    }
    init() {
        this.YingYue.forEach((music) => {
            let strs = "开头";
            if (strs == music.name) {
                this.node.getComponent(AudioSource).clip = music;
                AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
            }
        })

        for (let i = 0; i < find("Canvas/游戏背景/哪吒待机").children.length; i++) {
            let Position = find("Canvas/游戏背景/哪吒待机").children[i].position;
            tween(find("Canvas/游戏背景/哪吒待机").children[i])
                .to(0, { position: v3(Position.x, Position.y, Position.z) })
                .to(0.5, { position: v3(Position.x, Position.y - 10, Position.z) })
                .to(0.5, { position: v3(Position.x, Position.y, Position.z) })
                .union()
                .repeatForever()
                .start();
        }
        tween(find("Canvas/游戏背景/哪吒待机"))
            .to(0, { height: 630 })
            .to(0.5, { height: 610 })
            .to(0.5, { height: 630 })
            .union()
            .repeatForever()
            .start();
        for (let i = 0; i < find("Canvas/游戏背景/粉丝").children.length; i++) {
            let Height = find("Canvas/游戏背景/粉丝").children[i].getComponent(UITransform).height;
            tween(find("Canvas/游戏背景/粉丝").children[i])
                .to(0, { height: Height })
                .to(0.3, { height: Height - 10 })
                .to(0.3, { height: Height })
                .union()
                .repeatForever()
                .start();
        }
        let FensiPositiong = find("Canvas/游戏背景/粉丝/粉丝").children[0].position;
        tween(find("Canvas/游戏背景/粉丝/粉丝").children[0])
            .to(0, { position: v3(FensiPositiong.x, FensiPositiong.y, FensiPositiong.z) })
            .to(0.3, { position: v3(FensiPositiong.x, FensiPositiong.y - 5, FensiPositiong.z) })
            .to(0.3, { position: v3(FensiPositiong.x, FensiPositiong.y, FensiPositiong.z) })
            .union()
            .repeatForever()
            .start();

        let FensiPositiong1 = find("Canvas/游戏背景/粉丝/粉丝").children[1].position;
        tween(find("Canvas/游戏背景/粉丝/粉丝").children[1])
            .to(0, { position: v3(FensiPositiong1.x, FensiPositiong1.y, FensiPositiong1.z) })
            .to(0.3, { position: v3(FensiPositiong1.x, FensiPositiong1.y - 10, FensiPositiong1.z) })
            .to(0.3, { position: v3(FensiPositiong1.x, FensiPositiong1.y, FensiPositiong1.z) })
            .union()
            .repeatForever()
            .start();

        tween(find("Canvas/游戏背景/哪吒待机/对话框"))
            .call(() => {
                find("Canvas/游戏背景/哪吒待机/对话框").active = true;

            })
            .to(0, { scale: v3(0, 0, 0) })
            .to(0.5, { scale: v3(1, 1, 1) })
            .start();

        tween(find("Canvas/游戏背景/哪吒待机/嘴1").getComponent(UIOpacity))
            .to(0, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .delay(6)
            .call(() => {
                find("Canvas/游戏背景/哪吒待机/对话框").active = false;
                this.TipsLabelChange();
            })
            .call(() => {
                find("Canvas/游戏背景/哪吒待机/对话框").active = true;
            })

            .start();
    }
    start() {

        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.init, this);
        } else {
            this.init();
        }
    }
    Fensitwenn() {
        tween(find("Canvas/游戏背景/粉丝").children[0].getComponent(UIOpacity))
            .to(0, { opacity: 255 })
            .to(1, { opacity: 0 })
            .call(() => {
                find("Canvas/游戏背景/粉丝").children[0].destroy();
                find("Canvas/游戏背景/哪吒待机/答对嘴").active = false;
            })
            .start();
        let Position = find("Canvas/游戏背景/粉丝").children[0].position;
        tween(find("Canvas/游戏背景/粉丝").children[0])
            .to(0, { position: v3(Position.x, Position.y, Position.z), scale: v3(1, 1, 1) })
            .to(1, { position: v3(Position.x - 53, Position.y + 200, Position.z), scale: v3(0.8, 0.8, 1) })
            .start();
        let Position1 = find("Canvas/游戏背景/粉丝").position;
        tween(find("Canvas/游戏背景/粉丝"))
            .to(0, { position: v3(Position1.x, Position1.y, Position1.z) })
            .to(1, { position: v3(Position1.x - 90, Position1.y, Position1.z) })
            .start();
    }
    TweenWinChange() {
        find("Canvas/游戏背景/哪吒待机/答对嘴").active = true;
        find("Canvas/游戏背景/答题").active = false;
        NZJFS_GameManager.Instance.GameLevel += 1;
        tween(find("Canvas/游戏背景/哪吒待机/嘴1").getComponent(UIOpacity))
            .call(() => {
                find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "你是真粉丝,\n你可以进去了";
                this.YingYue.forEach((music) => {
                    let strs = "你是真粉丝你可以进去了";
                    if (strs == music.name) {
                        this.node.getComponent(AudioSource).clip = music;
                        AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                    }
                })

            })
            .delay(2.5)
            .call(() => {
                if (NZJFS_GameManager.Instance.GameLevel <= 7) {
                    this.TipsLabelChange();
                }
                else {
                    NZJFS_GameManager.Instance.win();
                }

            })

            .start();
    }
    TweenLoseChange() {

        find("Canvas/游戏背景/答题").active = false;
        find("Canvas/游戏背景/哪吒待机").getComponent(Sprite).enabled = false;
        find("Canvas/游戏背景/哪吒待机/哪吒攻击").active = true;
        find("Canvas/游戏背景/哪吒待机/对话框").children[0].getComponent(Label).string = "答错了,你这\n个假粉丝";
        this.YingYue.forEach((music) => {
            let strs = "找到假粉丝";
            if (strs == music.name) {
                this.node.getComponent(AudioSource).clip = music;
                AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
            }
        })
        find("Canvas/游戏背景/粉丝/粉丝").children[0].active = true;
        tween(this.node)
            .delay(2)
            .call(() => {


                NZJFS_GameManager.Instance.Lose();
            })
            .start();


    }
    Onclick() {

    }

    TipsLabelJudgment(event: Event) {
        this.YingYue.forEach((music) => {
            let strs = "按钮点击";
            if (strs == music.name) {
                this.node.getComponent(AudioSource).clip = music;
                AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
            }
        })
        switch (event.target.name) {
            case "Tips":
                if (NZJFS_GameManager.Instance.GameLevel == 0 && this.Tips.children[0].getComponent(Label).string == "小爷成魔不成仙") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 1 && this.Tips.children[0].getComponent(Label).string == "专和老天对着干") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 2 && this.Tips.children[0].getComponent(Label).string == "能降妖来会做诗") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();

                }
                else if (NZJFS_GameManager.Instance.GameLevel == 3 && this.Tips.children[0].getComponent(Label).string == "是一座大山") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 4 && this.Tips.children[0].getComponent(Label).string == "劈的我浑身掉渣渣") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 5 && this.Tips.children[0].getComponent(Label).string == "我们还有大把的时间") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 6 && this.Tips.children[0].getComponent(Label).string == "斩妖除魔我最擅长") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 7 && this.Tips.children[0].getComponent(Label).string == "我只要你死") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenLoseChange();
                        })
                        .start();


                }
                break;
            case "Tips1":
                if (NZJFS_GameManager.Instance.GameLevel == 0 && this.Tips1.children[0].getComponent(Label).string == "小爷成魔不成仙") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 1 && this.Tips1.children[0].getComponent(Label).string == "专和老天对着干") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 2 && this.Tips1.children[0].getComponent(Label).string == "能降妖来会做诗") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 3 && this.Tips1.children[0].getComponent(Label).string == "是一座大山") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 4 && this.Tips1.children[0].getComponent(Label).string == "劈的我浑身掉渣渣") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 5 && this.Tips1.children[0].getComponent(Label).string == "我们还有大把的时间") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 6 && this.Tips1.children[0].getComponent(Label).string == "斩妖除魔我最擅长") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 7 && this.Tips1.children[0].getComponent(Label).string == "我只要你死") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips1.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenLoseChange();
                        })
                        .start();


                }
                break;
            case "Tips2":
                if (NZJFS_GameManager.Instance.GameLevel == 0 && this.Tips2.children[0].getComponent(Label).string == "小爷成魔不成仙") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 1 && this.Tips2.children[0].getComponent(Label).string == "专和老天对着干") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 2 && this.Tips2.children[0].getComponent(Label).string == "能降妖来会做诗") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }

                else if (NZJFS_GameManager.Instance.GameLevel == 3 && this.Tips2.children[0].getComponent(Label).string == "是一座大山") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }

                else if (NZJFS_GameManager.Instance.GameLevel == 4 && this.Tips2.children[0].getComponent(Label).string == "劈的我浑身掉渣渣") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 5 && this.Tips2.children[0].getComponent(Label).string == "我们还有大把的时间") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 6 && this.Tips2.children[0].getComponent(Label).string == "斩妖除魔我最擅长") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else if (NZJFS_GameManager.Instance.GameLevel == 7 && this.Tips2.children[0].getComponent(Label).string == "我只要你死") {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenWinChange();
                            this.Fensitwenn();

                        })
                        .start();
                }
                else {
                    tween(this.node)
                        .call(() => {
                            find("Canvas/游戏背景/答题").active = false;

                            this.YingYue.forEach((music) => {
                                let strs = this.Tips2.children[0].getComponent(Label).string;
                                if (strs == music.name) {
                                    this.node.getComponent(AudioSource).clip = music;
                                    AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                                }
                            })
                        })
                        .delay(2)
                        .call(() => {
                            this.TweenLoseChange();
                        })
                        .start();



                }
                break;
        }
    }
}

