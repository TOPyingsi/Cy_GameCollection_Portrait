import { _decorator, AudioClip, Color, Component, Event, EventTouch, find, Input, instantiate, Label, Layout, Node, Prefab, Size, sp, Sprite, SpriteFrame, tween, UITransform, Vec2 } from 'cc';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { SJZ_PropCtrl } from './SJZ_PropCtrl';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { SJZ_InventoryGrid } from './SJZ_InventoryGrid';
import { SJZ_ItemData, SJZ_Quality } from './SJZ_Data';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SJZ_GameManager')
export class SJZ_GameManager extends Component {
    public static instance: SJZ_GameManager = null;

    @property([SpriteFrame]) dbxSF: SpriteFrame[] = [];
    @property(Prefab) propPrefb: Prefab = null;
    @property(Node) propParent: Node = null;
    @property(Node) BXIcon: Node = null;
    @property(Node) items: Node = null;
    @property(Node) emoji: Node = null;
    @property([SpriteFrame]) emojisf: SpriteFrame[] = [];
    @property(Node) button: Node = null;
    @property(AudioClip) audio1: AudioClip = null;
    @property(AudioClip) audio2: AudioClip = null;
    @property(AudioClip) BGM: AudioClip = null;
    @property(Prefab) Map: Prefab = null;
    @property(Node) playArea: Node = null;
    @property(GamePanel) gamepanel: GamePanel = null;
    @property(Node) itemsBG: Node = null;

    PriceMap: Map<string, number> = new Map([
        ["雷斯的留声机", 1354325],
        ["赛伊德的怀表", 275834],
        ["滑膛枪展品", 786124],
        ["棘龙爪化石", 235461],
        ["名贵机械表", 196548],
        ["军用电台", 862465],
        ["军用无人机", 572341],
        ["军用控制终端", 354321],
        ["军用信息终端", 734548],
        ["克劳迪乌斯半身像", 1257375],
        ["主战坦克模型", 2137415],
        ["万足金条", 334221],
        ["非洲之心", 13140000],
    ])

    activeProps: string[] = [];

    // private x: number = 0;

    girdCtrl: SJZ_InventoryGrid = null;

    itemData: SJZ_ItemData[] = [];

    protected onLoad(): void {
        SJZ_GameManager.instance = this;
        this.girdCtrl = new SJZ_InventoryGrid(6, 6);

        for (const key of SJZ_PropCtrl.propInfo.keys()) {
            let value = SJZ_PropCtrl.propInfo.get(key);
            let data = new SJZ_ItemData(key, value.quality, value.size);
            this.itemData.push(data);
        }
        console.log("onload", this.itemData);

        this.gamepanel.time = 600;
    }

    protected start(): void {
        AudioManager.Instance.PlayBGM(this.BGM);
    }

    // randomSF() {
    //     let result: SJZ_ItemData[] = [];
    //     const num = Tools.GetRandomIntWithMax(1, 4);
    //     for (let i = 0; i < num; i++) {
    //         const node = instantiate(this.propPrefb);
    //         const com = node.getComponent(SJZ_PropCtrl)
    //         com.searchIcon.parent.active = true;
    //         const randomNum = Tools.GetRandomInt(0, this.itemData.length);
    //         let data = this.itemData[randomNum];
    //         result.push(Tools.Clone(data));
    //         com.initProp(data)
    //         node.parent = this.propParent;
    //     }
    //     console.log("----------------------------", result);
    //     SJZ_GameManager.FillContainerByData(result, this.girdCtrl);
    //     this.updatePos();
    // }

    randomSF() {
        const num = Tools.GetRandomIntWithMax(1, 4);
        for (let i = 0; i < num; i++) {
            const width = Tools.GetRandomIntWithMax(1, 100);
            const node = instantiate(this.propPrefb);
            const com = node.getComponent(SJZ_PropCtrl)
            com.searchIcon.parent.active = true;
            let sf: SpriteFrame = null;
            let list: string[] = [];

            console.log("权重", width);

            if (width >= 1 && width <= 35) {
                list = SJZ_PropCtrl.getPropsByQuality(SJZ_Quality.Rare)
            } else if (width > 35 && width <= 70) {
                list = SJZ_PropCtrl.getPropsByQuality(SJZ_Quality.Superior)
            } else if (width > 70 && width <= 95) {
                list = SJZ_PropCtrl.getPropsByQuality(SJZ_Quality.Legendary)
            } else if (width > 95 && width <= 100) {
                list = SJZ_PropCtrl.getPropsByQuality(SJZ_Quality.Mythic)
            }
            const randomStr = list[Tools.GetRandomInt(0, list.length - 1)];
            sf = this.dbxSF.find(sf => sf.name === randomStr);
            com.initProp(sf);
            node.name = sf.name;
            node.parent = this.propParent;
        }
        this.updatePos();
    }


    updatePos() {
        const nodes = this.propParent.children;
        if (nodes.length === 0) return;

        const parentSize = this.propParent.getComponent(UITransform).contentSize;
        const parentWidth = parentSize.width;
        const baseX = -(parentWidth / 2) + 74.5; // 起始X坐标
        let currentY = (parentSize.height / 2) - 74.5; // 起始Y坐标

        let currentLineWidth = 0;
        let currentLineMaxHeight = 0;
        let currentLineNodes: Node[] = [];

        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i]) continue;

            const nodeTransform = nodes[i].getComponent(UITransform);
            if (!nodeTransform) continue;

            const nodeSize = nodeTransform.contentSize;

            // 检查当前行是否还能容纳该节点
            if (currentLineWidth + nodeSize.width > 910 && currentLineNodes.length > 0) {
                console.log("换行", currentLineWidth, parentWidth);
                // 换行处理
                currentY -= currentLineMaxHeight; // 下移一行
                currentLineWidth = 0; // 重置行宽
                currentLineMaxHeight = 0; // 重置行高
                currentLineNodes = []; // 清空当前行节点
            }

            // 设置节点位置
            nodes[i].setPosition(
                baseX + currentLineWidth,
                currentY
            );

            // 更新当前行状态
            currentLineWidth += nodeSize.width;
            currentLineMaxHeight = Math.max(currentLineMaxHeight, nodeSize.height);
            currentLineNodes.push(nodes[i]);
        }
    }

    private mapNode: Node;
    onbuttonClick(event: Event) {
        console.log(event.target.name);
        switch (event.target.name) {
            case "Button":
                this.BXIcon.active = false;
                this.items.active = true;
                this.propParent.active = true;
                if (this.propParent.children.length > 0) {
                    this.propParent.removeAllChildren();
                }
                if (this.emoji.getChildByName("Label").active) {
                    this.emoji.getChildByName("Label").active = false;
                }
                this.emoji.getComponent(Sprite).spriteFrame = this.emojisf[1];
                this.itemsBG.active = true;
                this.button.active = false;
                this.randomSF();
                this.ani(0)
                break;
            case "MapButton":
                this.mapNode = instantiate(this.Map)
                const label = this.mapNode.getChildByName("Title").getComponent(Label)

                this.mapNode.on(Input.EventType.TOUCH_START, this.TOUCH_START, this);
                const nodes = this.mapNode.getChildByName("Body").children
                let countPrice = 0
                for (let i = 0; i < this.activeProps.length; i++) {
                    const n = nodes.find(node => node.name == this.activeProps[i])
                    n.getComponent(Sprite).grayscale = false;
                    n.getChildByName("Icon").active = true;
                    n.getChildByName("Label").active = true;
                    countPrice += this.PriceMap.get(n.name)
                    label.string = `收藏总价值：${countPrice}`
                }
                this.mapNode.setParent(this.playArea);
                this.mapNode.setSiblingIndex(this.playArea.children.length)
                break;
        }
    }

    TOUCH_START(event: EventTouch) {
        this.mapNode.destroy()
    }

    private ani(index: number = 0) {
        const nodes = this.propParent.children;
        if (index >= nodes.length) {
            this.button.active = true; // 所有动画结束后激活按钮
            this.button.getChildByName("Label").getComponent(Label).string = "继续吃";
            return;
        }

        const node = nodes[index];
        const com = node.getComponent(SJZ_PropCtrl);
        const c = com.BG.getComponent(Sprite).color;
        const search = com.searchIcon;

        let time = 0;
        let audio = null;

        if (c.equals(SJZ_PropCtrl.blueColor)) {
            time = 1, audio = this.audio1;
        } else if (c.equals(SJZ_PropCtrl.purpleColor)) {
            time = 1.5, audio = this.audio1;
        } else if (c.equals(SJZ_PropCtrl.goldColor)) {
            time = 2, audio = this.audio2;
        } else if (c.equals(SJZ_PropCtrl.redColor)) {
            time = 2.5, audio = this.audio2, this.activeProps.push(node.name);
        }

        const ske = search.getComponent(sp.Skeleton)
        ske.loop = true;
        ske.setAnimation(0, "animation", false);
        this.scheduleOnce(() => {
            this.updateEmoji(node);
            search.parent.active = false;
            AudioManager.Instance.PlaySFX(audio);
            this.ani(index + 1); // 播放下一个动画
        }, time);

        // tween(search)
        //     .to(time, { angle: sca })
        //     .call(() => {
        //         this.updateEmoji(node);
        //         search.parent.active = false;
        //         AudioManager.Instance.PlaySFX(audio);
        //         this.ani(index + 1); // 播放下一个动画
        //     })
        //     .start();
    }

    updateEmoji(node: Node) {
        if (node) {
            const color = node.getComponent(SJZ_PropCtrl).BG.getComponent(Sprite).color
            const sp = this.emoji.getComponent(Sprite)
            if (color.equals(SJZ_PropCtrl.blueColor)) {
                sp.spriteFrame = this.emojisf[5];
            } else if (color.equals(SJZ_PropCtrl.purpleColor)) {
                sp.spriteFrame = this.emojisf[4];
            } else if (color.equals(SJZ_PropCtrl.goldColor)) {
                sp.spriteFrame = this.emojisf[2];
            } else if (color.equals(SJZ_PropCtrl.redColor)) {
                sp.spriteFrame = this.emojisf[3];
            }
        }
    }

    // public static FillContainerByData(data: SJZ_ItemData[], gridCtrl: SJZ_InventoryGrid) {
    //     let gridLength = gridCtrl.width * gridCtrl.height;
    //     let finalData: SJZ_ItemData[] = [];

    //     for (let i = 0; i < data.length; i++) {
    //         let e = data[i];
    //         for (let j = 0; j < gridLength; j++) {
    //             let x = j % gridCtrl.width;
    //             let y = Math.floor(j / gridCtrl.width);
    //             if (gridCtrl.grid[y][x] == 0) {
    //                 if (SJZ_InventoryGrid.CanPlaceItem(gridCtrl, x, y, e.Size.width, e.Size.height)) {
    //                     SJZ_InventoryGrid.PlaceItem(gridCtrl, x, y, e.Size.width, e.Size.height);
    //                     e.Point.x = x;
    //                     e.Point.y = y;
    //                     finalData.push(e);
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     return finalData;
    // }

}


