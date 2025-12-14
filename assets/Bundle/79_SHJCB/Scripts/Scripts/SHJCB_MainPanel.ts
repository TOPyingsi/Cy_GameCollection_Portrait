import { _decorator, Animation, AnimationClip, Component, Label, Node, Prefab, sp, Sprite, SpriteFrame, Tween, tween, UIOpacity, v3 } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import { eventCenter } from './SHJCB_EventCenter';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { SHJCB_Coin } from './SHJCB_Coin';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_MainPanel')
export class SHJCB_MainPanel extends SHJCB_UIBase {

    private static instance: SHJCB_MainPanel;
    public static get Instance(): SHJCB_MainPanel {
        return this.instance;
    }

    @property(Prefab)
    coinPrefab: Prefab;

    @property({ type: sp.Skeleton, group: "Spine" })
    player: sp.Skeleton;

    @property({ type: sp.Skeleton, group: "Spine" })
    head: sp.Skeleton;

    @property({ type: sp.Skeleton, group: "Spine" })
    pet: sp.Skeleton;

    @property({ type: Label, group: "Label" })
    levelLabel: Label;

    @property({ type: Label, group: "Label" })
    coinLabel: Label;

    @property({ type: Label, group: "Label" })
    coinAddLabel: Label;

    @property({ type: Label, group: "Label" })
    fansLabel: Label;

    @property({ type: Sprite, group: "Sprite" })
    expSprite: Sprite;

    @property({ type: Sprite, group: "Sprite" })
    bg: Sprite;

    @property({ type: Sprite, group: "Sprite" })
    table: Sprite;

    @property({ type: Sprite, group: "Sprite" })
    decor: Sprite;

    @property({ type: Animation, group: "Ani" })
    left: Animation;

    @property({ type: Animation, group: "Ani" })
    right: Animation;

    @property({ type: Animation, group: "Ani" })
    down: Animation;

    @property({ type: Animation, group: "Ani" })
    decorMain: Animation;

    @property({ type: Node, group: "Panel" })
    upgradePanel: Node;

    @property({ type: Node, group: "Panel" })
    supermarketPanel: Node;

    @property({ type: Node, group: "Panel" })
    parttimePanel: Node;

    @property({ type: Node, group: "Panel" })
    dailyPanel: Node;

    @property({ type: Node, group: "Panel" })
    shopPanel: Node;

    @property({ type: Node, group: "Panel" })
    supermarketLivePanel: Node;

    @property({ type: Node, group: "Panel" })
    supermarketEndPanel: Node;

    @property({ type: Node, group: "Panel" })
    fanUpgradePanel: Node;

    @property({ type: Node, group: "Panel" })
    livePanel: Node;

    @property({ type: Node, group: "Panel" })
    gamePanel: Node;

    @property({ type: Node, group: "Panel" })
    completePanel: Node;

    @property({ type: Node, group: "Panel" })
    eatPanel: Node;

    @property({ type: Node, group: "Panel" })
    endPanel: Node;

    @property({ type: Node, group: "Panel" })
    decorPanel: Node;

    @property({ type: Node, group: "Panel" })
    playerPanel: Node;

    @property({ type: Node, group: "Panel" })
    gachaPanel: Node;

    @property({ type: Node, group: "Panel" })
    coinPanel: Node;

    @property({ type: Node, group: "Panel" })
    needPanel: Node;

    @property({ type: Node, group: "Panel" })
    fadePanel: Node;

    @property([sp.SkeletonData])
    petData: sp.SkeletonData[] = [];

    @property([SpriteFrame])
    decorBgSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    decorTableSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    decorSfs: SpriteFrame[] = [];

    isTween = false;
    isPet = false;

    protected onLoad(): void {
        SHJCB_MainPanel.instance = this;
        this._InitUpdateEvent();
        this._InitDaily();
        ProjectEventManager.emit(ProjectEvent.游戏开始, "果冻大师：吃播ASMR");
    }

    _InitDaily() {
        let lastDaily = SHJCB_DataManager.Instance.getArrayData("LastDaily");
        let date = new Date;
        if (lastDaily.length == 0 || !(lastDaily.length > 0 && lastDaily[0] == date.getFullYear() && lastDaily[1] == date.getMonth() && lastDaily[2] == date.getDate())) this.OpenDaily();
    }

    protected _InitData() {
        this._UpdateFans();
        this._UpdateLevel();
        this._UpdateCoin();
        this._UpdateExp();
        this._UpdateSkin();
        this._UpdatePet();
        this._UpdateBg();
        this._UpdateTable();
        this._UpdateDecor();
    }

    protected _InitUpdateEvent() {
        eventCenter.on("SetData:SHJCB_Level", this._UpdateLevel, this);
        eventCenter.on("SetData:SHJCB_Coin", this._UpdateCoin, this);
        eventCenter.on("SetData:SHJCB_Exp", this._UpdateExp, this);
        eventCenter.on("SetData:SHJCB_Fans", this._UpdateFans, this);
        eventCenter.on("SetData:SHJCB_Skin", this._UpdateSkin, this);
        eventCenter.on("SetData:SHJCB_Pet", this._UpdatePet, this);
        eventCenter.on("SetData:SHJCB_Bg", this._UpdateBg, this);
        eventCenter.on("SetData:SHJCB_Table", this._UpdateTable, this);
        eventCenter.on("SetData:SHJCB_Decor", this._UpdateDecor, this);
    }

    _UpdateLevel() {
        this._UpdateLabel(this.levelLabel, "Level", "等级 ");
    }

    _UpdateCoin() {
        SHJCB_DataManager.deltaCoin = SHJCB_DataManager.Instance.getNumberData("Coin") - parseInt(this.coinLabel.string);
        if (parseInt(this.coinLabel.string) == -1) this._UpdateLabel(this.coinLabel, "Coin");
        else {
            let num = Math.floor(SHJCB_DataManager.deltaCoin / 50);
            if (SHJCB_DataManager.deltaCoin > 0) {
                this.coinAddLabel.string = "+" + SHJCB_DataManager.deltaCoin;
                this.coinAddLabel.node.setWorldPosition(SHJCB_DataManager.coinSpawn);
                this.coinAddLabel.getComponent(UIOpacity).opacity = 255;
                Tween.stopAllByTarget(this.coinAddLabel.node);
                Tween.stopAllByTarget(this.coinAddLabel.getComponent(UIOpacity));
                tween(this.coinAddLabel.node).by(1, { position: v3(0, 100) }).start();
                tween(this.coinAddLabel.getComponent(UIOpacity)).to(1, { opacity: 0 }).start();
            }
            if (Math.abs(SHJCB_DataManager.deltaCoin) > 1000) {
                if (SHJCB_DataManager.deltaCoin > 0) {
                    this.schedule(() => {
                        let coin: Node = PoolManager.GetNodeByPrefab(this.coinPrefab, SHJCB_MainPanel.Instance.coinPanel);
                        coin.setWorldPosition(SHJCB_DataManager.coinSpawn);
                        if (SHJCB_DataManager.deltaCoin > num) {
                            SHJCB_DataManager.deltaCoin -= num;
                            coin.getComponent(SHJCB_Coin).price = num;
                        }
                        else {
                            coin.getComponent(SHJCB_Coin).price = SHJCB_DataManager.deltaCoin;
                            SHJCB_DataManager.deltaCoin = 0;
                        }
                    }, 0.02, 49);
                }
                else {
                    let num2 = num *= -1;
                    this.schedule(() => {
                        let price = 0;
                        if (SHJCB_DataManager.deltaCoin < -num2) {
                            SHJCB_DataManager.deltaCoin += num2;
                            price = -num2;
                        }
                        else {
                            price = SHJCB_DataManager.deltaCoin;
                            SHJCB_DataManager.deltaCoin = 0;
                        }
                        let num3 = parseInt(this.coinLabel.string) + price;
                        this.coinLabel.string = num3.toString();
                    }, 0.02, 49);
                }
            }
            else {
                if (SHJCB_DataManager.deltaCoin > 0) {
                    this.schedule(() => {
                        if (SHJCB_DataManager.deltaCoin <= 0) return;
                        let coin: Node = PoolManager.GetNodeByPrefab(this.coinPrefab, SHJCB_MainPanel.Instance.coinPanel);
                        coin.setWorldPosition(SHJCB_DataManager.coinSpawn);
                        if (SHJCB_DataManager.deltaCoin >= 50) {
                            SHJCB_DataManager.deltaCoin -= 50;
                            coin.getComponent(SHJCB_Coin).price = 50;
                        }
                        else if (SHJCB_DataManager.deltaCoin > 0) {
                            coin.getComponent(SHJCB_Coin).price = SHJCB_DataManager.deltaCoin;
                            SHJCB_DataManager.deltaCoin = 0;
                        }
                    }, 0.02, num);
                }
                else {
                    num *= -1;
                    this.schedule(() => {
                        let price = 0;
                        if (SHJCB_DataManager.deltaCoin <= -50) {
                            SHJCB_DataManager.deltaCoin += 50;
                            price = -50;
                        }
                        else if (SHJCB_DataManager.deltaCoin < 0) {
                            price = SHJCB_DataManager.deltaCoin;
                            SHJCB_DataManager.deltaCoin = 0;
                        }
                        else return;
                        let num2 = parseInt(this.coinLabel.string) + price;
                        this.coinLabel.string = num2.toString();
                    }, 0.02, num);
                }
            }
        }
    }

    _UpdateExp() {
        this._UpdateProgress(this.expSprite, "Exp", "ExpLimit");
        if (this.expSprite.fillRange >= 1) {
            let level = SHJCB_DataManager.Instance.getNumberData("Level");
            level++;
            SHJCB_DataManager.Instance.setNumberData("Level", level);
            let exp = SHJCB_DataManager.Instance.getNumberData("Exp");
            let limit = SHJCB_DataManager.Instance.getNumberData("ExpLimit");
            exp -= limit;
            SHJCB_DataManager.Instance.setNumberData("Exp", exp);
            limit += 100;
            SHJCB_DataManager.Instance.setNumberData("ExpLimit", limit);
            this._OpenUpgrade();
        }
    }

    _UpdateSkin() {
        let num = SHJCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
        this.head.setSkin("pifu" + num);
    }

    _UpdatePet() {
        let num = SHJCB_DataManager.Instance.getNumberData("Pet");
        if (num == -1) return;
        this.pet.skeletonData = this.petData[num];
        this.pet.animation = "daiji";
    }

    _UpdateBg() {
        let num = SHJCB_DataManager.Instance.getNumberData("Bg");
        this.bg.spriteFrame = this.decorBgSfs[num];
    }

    _UpdateTable() {
        let num = SHJCB_DataManager.Instance.getNumberData("Table");
        this.table.spriteFrame = this.decorTableSfs[num];
    }

    _UpdateDecor() {
        let num = SHJCB_DataManager.Instance.getNumberData("Decor");
        this.decor.spriteFrame = this.decorSfs[num];
    }

    _UpdateFans() {
        let num = SHJCB_DataManager.Instance.getNumberData("Fans");
        let level = SHJCB_DataManager.Instance.getNumberData("FanLevel");
        this.fansLabel.string = `粉丝 ${num}`;
        if (num >= SHJCB_DataManager.fanLevelNums[level + 1]) {
            level++;
            SHJCB_DataManager.Instance.setNumberData("FanLevel", level);
            this._OpenFanUpgrade();
        }
    }

    _OpenFanUpgrade() {
        this.fanUpgradePanel.active = true;
        let ani = this.fanUpgradePanel.getComponent(Animation);
        ani.getState("fanUpgrade").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    _OpenMain() {
        if (this.isTween) return;
        this.isTween = true;
        this.left.getState("leftButtons").wrapMode = AnimationClip.WrapMode.Reverse;
        this.right.getState("rightButtons").wrapMode = AnimationClip.WrapMode.Reverse;
        this.down.getState("downButtons").wrapMode = AnimationClip.WrapMode.Reverse;
        this.left.play();
        this.right.play();
        this.down.play();
        this.scheduleOnce(() => { this.isTween = false; }, 0.5);
    }

    _CloseMain() {
        if (this.isTween) return;
        this.isTween = true;
        this.left.getState("leftButtons").wrapMode = AnimationClip.WrapMode.Default;
        this.right.getState("rightButtons").wrapMode = AnimationClip.WrapMode.Default;
        this.down.getState("downButtons").wrapMode = AnimationClip.WrapMode.Default;
        this.left.play();
        this.right.play();
        this.down.play();
        this.scheduleOnce(() => { this.isTween = false; }, 0.5);
    }

    _OpenNeed() {
        this.needPanel.active = true;
        let ani = this.needPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    _OpenUpgrade() {
        this.upgradePanel.active = true;
        let ani = this.upgradePanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    ClickPet() {
        if (!this.pet.skeletonData) return;
        if (this.isPet) return;
        let data = SHJCB_DataManager.Instance.getNumberData("Pet");
        SHJCB_AudioManager.Instance._PlaySound(26 + data);
        this.isPet = true;
        this.pet.animation = "hudong";
        let time = this.pet.findAnimation("hudong").duration;
        this.scheduleOnce(this.ResetPet, time);
    }

    ResetPet() {
        this.isPet = false;
        this.pet.animation = "daiji";
    }

    ReadyToPlay() {
        SHJCB_AudioManager.Instance._PlaySound(1);
        this._CloseMain();
        this.scheduleOnce(() => {
            this.livePanel.active = true;
        }, 0.5);
    }

    OpenSuperMarket() {
        this.supermarketPanel.active = true;
    }

    OpenParttime() {
        this.parttimePanel.active = true;
    }

    OpenDaily() {
        this.dailyPanel.active = true;
        let ani = this.dailyPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    OpenShop() {
        this.shopPanel.active = true;
        let ani = this.shopPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    OpenDecor() {
        this._CloseMain();
        this.decorPanel.active = true;
        let ani = this.decorPanel.getComponent(Animation);
        ani.getState("decorPanel").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
        this.decorMain.getState("decorMain").wrapMode = AnimationClip.WrapMode.Reverse;
        this.decorMain.play();
    }

    OpenPlayer() {
        this.playerPanel.active = true;
        let ani = this.playerPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    OpenGacha() {
        this.gachaPanel.active = true;
        let ani = this.gachaPanel.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Reverse;
        ani.play();
    }

    _Fade(callback: Function);
    _Fade(closePanel: Node, openPanel: Node);
    _Fade(arg: Node | Function, openPanel?: Node) {
        SHJCB_AudioManager.Instance._PlaySound(52);
        this.fadePanel.active = true;
        this.fadePanel.children[1].setPosition(v3(1500, -2000));
        tween(this.fadePanel.children[0].getComponent(UIOpacity))
            .to(0.5, { opacity: 255 })
            .call(() => {
                if (openPanel) {
                    (arg as Node).active = false;
                    openPanel.active = true;
                }
                else (arg as Function)();
            })
            .to(0.5, { opacity: 0 })
            .start();
        tween(this.fadePanel.children[1])
            .to(1, { position: v3(-1500, 2000) })
            .call(() => { this.fadePanel.active = false; })
            .start();
    }

    OpenGame() {
        this._Fade(this.livePanel, this.gamePanel);
    }

}