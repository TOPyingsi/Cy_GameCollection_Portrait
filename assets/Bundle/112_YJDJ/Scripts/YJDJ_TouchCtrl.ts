import { _decorator, AudioSource, Component, EventTouch, Node, UIOpacity, Vec3 } from 'cc';
import { TouchCtrl } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
import { YJDJ_GameMgr } from './YJDJ_GameMgr';
import { TimerControl } from 'db://assets/Scripts/Framework/Managers/TimerControl';
import { YJDJ_MoveSelf } from './YJDJ_MoveSelf';
const { ccclass, property } = _decorator;

/*
    0弓箭 1窗帘 2针 3椰子汁
    4高跟鞋 5包 6手机 7冰箱门
    8冰箱 9冰袋 10蚊子 11筋膜枪
    12木棍 13柜子 14消毒水 15缩骨功
    16水袋
*/

export enum YJDJ_TouchType {
    弓箭 = 0,
    窗帘 = 1,
    针 = 2,
    椰子汁 = 3,
    高跟鞋 = 4,
    包 = 5,
    手机 = 6,
    冰箱门 = 7,
    冰箱 = 8,
    冰袋 = 9,
    蚊子 = 10,
    筋膜枪 = 11,
    木棍 = 12,
    柜子交互 = 13,
    消毒水 = 14,
    缩骨功 = 15,
    水袋 = 16,
    暖宝宝 = 17,
}

@ccclass('YJDJ_TouchCtrl')
export class YJDJ_TouchCtrl extends TouchCtrl {
    start() {
        super.initData();
        super.start();

        // console.log(YJDJ_TouchType[this.TouchID]);
    }

    onTouchStart(event: EventTouch): void {
        if (YJDJ_GameMgr.instance.isTalk || YJDJ_GameMgr.instance.isGameOver) {
            return;
        }
        super.onTouchStart(event);
    }

    onTouchMove(event: EventTouch, target?: any): void {
        if (YJDJ_GameMgr.instance.isTalk || YJDJ_GameMgr.instance.isGameOver) {
            return;
        }
        super.onTouchMove(event, target);
    }

    onTouchEnd(event: EventTouch): void {
        if (YJDJ_GameMgr.instance.isTalk || YJDJ_GameMgr.instance.isGameOver) {
            return;
        }
        super.onTouchEnd(event);
    }

    touchStartEvent(endPos: Vec3): void {
        YJDJ_GameMgr.instance.playMgrSFX("物品");
        switch (YJDJ_TouchType[this.TouchID]) {
            case "蚊子":
                let uiOpacity = this.node.getChildByName("蚊子移动").getComponent(UIOpacity);
                uiOpacity.opacity = 0;

                this.node.getChildByName("蚊子").active = true;
        }
    }

    touchMoveEvent(touchPos: Vec3, target?: any): void {
        switch (YJDJ_TouchType[this.TouchID]) {
            case "椰子汁":
            case "弓箭":
                target = YJDJ_GameMgr.instance.player.getChildByName("PlayerArea");
                break;
            case "消毒水":
                target = YJDJ_GameMgr.instance.propNode.getChildByName("针");
                break;
            default:
                target = YJDJ_GameMgr.instance.FeetNode;
                break;
        }

        super.touchMoveEvent(touchPos, target);

    }
    touchEndEvent(endPos: Vec3): void {

        switch (this.node.name) {
            case "冰箱门":
                this.MakeIceBag();
                break;
            case "冰箱遮罩":
                this.openFridge();
                break;
            case "木棍":
                this.node.setSiblingIndex(6);
                break;
            case "包":
                this.openBag();
                break;
            case "柜子交互":
                this.openChest();
                break;

        }

        if (this.isTruePos) {
            if (this.node.name === "水袋") {
                this.refreshPos();
                return;
            }

            switch (YJDJ_TouchType[this.TouchID]) {
                case "椰子汁":
                    YJDJ_GameMgr.instance.playAni("椰子汁");
                    break;
                case "弓箭":

                    // TimerControl.Instance.AddIncident("射箭", () => {
                    //     YJDJ_GameMgr.instance.isDisinfect = true;
                    // }, 1.5, this.node);

                    YJDJ_GameMgr.instance.playAni("射箭");

                    YJDJ_GameMgr.instance.playSFX("射箭音效");

                    break;
                case "消毒水":

                    TimerControl.Instance.AddIncident("已消毒", () => {
                        YJDJ_GameMgr.instance.isDisinfect = true;
                    }, 1.5, this.node);

                    YJDJ_GameMgr.instance.playAni("消毒");
                    YJDJ_GameMgr.instance.playSFX("消毒水音效");
                    break;
                case "针":
                    if (YJDJ_GameMgr.instance.isDisinfect) {
                        YJDJ_GameMgr.instance.playAni("针");
                        YJDJ_GameMgr.instance.playSFX("针音效");
                    }
                    else {
                        YJDJ_GameMgr.instance.playAni("烂脚");
                    }
                    break;
                case "高跟鞋":
                    if (YJDJ_GameMgr.instance.reduceNum === 9) {
                        //胜利
                        YJDJ_GameMgr.instance.playAni("胜利");
                    }
                    else {
                        YJDJ_GameMgr.instance.playAni("碎鞋");
                    }
                    break;
                default:
                    YJDJ_GameMgr.instance.playAni(YJDJ_TouchType[this.TouchID]);

                    YJDJ_GameMgr.instance.playSFX(YJDJ_TouchType[this.TouchID] + "音效");


                    break;
            }

            this.node.active = false;
            if (this.node.name !== "窗帘") {
                YJDJ_GameMgr.instance.playMgrSFX("物品正确");
            }

        }
        else {
            if (this.node.name === "蚊子") {
                let uiOpacity = this.node.getChildByName("蚊子移动").getComponent(UIOpacity);
                uiOpacity.opacity = 255;

                this.node.getChildByName("蚊子").active = false;
            }
            if (this.node.name === "筋膜枪") {
                this.node.setSiblingIndex(10);
            }
        }
    }

    openBag() {
        this.node.getChildByName("包包盖子").active = false;
        this.node.getChildByName("暖宝宝").active = true;
    }

    openChest() {
        this.node.getChildByName("柜子遮罩").active = false;
        this.node.getChildByName("消毒水").active = true;
        this.node.getChildByName("柜门开").active = true;

        let propTs = this.node.getChildByName("消毒水").getComponent(YJDJ_TouchCtrl);
        propTs.couldMove = true;
    }

    openFridge() {
        YJDJ_GameMgr.instance.playMgrSFX("物品");

        let fridge = YJDJ_GameMgr.instance.propNode.getChildByName("冰箱");

        let waterBag = fridge.getChildByName("水袋");
        let iceBag = fridge.getChildByName("冰袋");

        let waterBagTs = waterBag.getComponent(YJDJ_TouchCtrl);
        let iceBagTs = iceBag.getComponent(YJDJ_TouchCtrl);

        if (YJDJ_GameMgr.instance.isIceBagShow) {
            this.node.active = false;

            iceBag.active = true;
            waterBag.active = false;

            iceBagTs.couldMove = true;
        }
        else {
            this.node.active = false;
            waterBagTs.couldMove = true;
            //10秒后关闭冰箱
            this.scheduleOnce(() => {
                this.node.active = true;
                //重置水袋父节点,坐标
                let pos = this.startPos;
                waterBag.parent = fridge;
                waterBag.setSiblingIndex(1);
                waterBag.worldPosition = pos;
                //禁用触摸移动属性
                iceBagTs.couldMove = false;
                waterBagTs.couldMove = false;
            }, 10);
        }
    }

    MakeIceBag() {
        YJDJ_GameMgr.instance.playMgrSFX("冰箱音效");

        this.node.getChildByName("常温").active = false;
        this.node.getChildByName("冷冻").active = true;

        let fridge = YJDJ_GameMgr.instance.propNode.getChildByName("冰箱");
        let waterBag = fridge.getChildByName("冰袋");
        let iceBag = fridge.getChildByName("冰袋");

        waterBag.active = false;
        iceBag.active = true;

        YJDJ_GameMgr.instance.isIceBagShow = true;

    }

    refreshPos() {
        if (this.isTopLayer) {
            this.node.parent = this.startParent;
        }
        this.node.worldPosition = this.startPos;
    }
}


