import { _decorator, Color, Component, JsonAsset, Label, Node, NodeEventType, Sprite, sys, Animation, Vec3 } from 'cc';
import { SXZW_WaponsItem } from './SXZW_WaponsItem';
import { SXZW_HomeManage } from './SXZW_HomeManage';
import { SXZW_GameManage } from './SXZW_GameManage';
import { SXZW_AudioManage } from './SXZW_AudioManage';
import Banner from 'db://assets/Scripts/Banner';
import { SXZW_Utils } from './SXZW_Utils';
const { ccclass, property } = _decorator;

@ccclass('SXZW_WeaponsManage')
export class SXZW_WeaponsManage extends Component {

    private static _instance: SXZW_WeaponsManage = null;

    public static get Instance() {
        if (this._instance == null) {
            console.error("WeaponsManage instance is null, please ensure it is initialized before accessing.");
        }
        return this._instance;
    }

    @property(Node)
    weaponsItemListPlanet: Node = null;

    @property(Node)
    weaponsItemTopListPlanet: Node = null;

    @property(Sprite)
    weaponItemFloorImage: Sprite = null;

    // ---------------- 属性信息显示

    @property(Node)
    equipInfoNode: Node = null;

    @property(Sprite)
    equipInfoImage: Sprite = null;

    @property(Node)
    equipButton: Node = null

    @property(Label)
    upgeadeButtonLabel: Label = null

    @property(Label)
    weaponItemDamageLabel: Label = null;

    @property(Label)
    weaponItemPushForceLabel: Label = null;

    @property(Label)
    weaponItemDamageRangeLabel: Label = null;

    @property(Sprite)
    weaponItemDamageRangeSprite: Sprite = null;

    @property(Label)
    weaponItemNameLabe: Label = null

    @property(Label)
    weaponItemLvLabel: Label = null

    @property({ type: JsonAsset, tooltip: "武器等级数据JSON" })
    levelDatasJson: JsonAsset = null;

    private currentEquipWapon: SXZW_WaponsItem = null;
    public equipWaponNodeList: SXZW_WaponsItem[] // 装备的武器节点

    private weaponsItemList: { [key: string]: SXZW_WaponsItem } = {}

    private static defaultData = { "top1": "剪刀", "top2": "刀", "top3": "石头", "top4": "斧头", "top5": "锤子", "top6": "保龄球", "top7": "手雷", "top8": "尖刺球" }

    protected onLoad(): void {
        if (SXZW_WeaponsManage._instance) {
            SXZW_WeaponsManage._instance.destroy();
        }
        SXZW_WeaponsManage._instance = this;
        const list = this.weaponsItemListPlanet.getComponentsInChildren(SXZW_WaponsItem)
        this.equipWaponNodeList = this.weaponsItemTopListPlanet.getComponentsInChildren(SXZW_WaponsItem)
        list.forEach(element => {
            if (element.itemName !== "") this.weaponsItemList[element.itemName] = element;
        });
    }

    start() {
        const topItems = sys.localStorage.getItem("sxzw_topItems")
        const names = SXZW_Utils.JsonTryParse(topItems, SXZW_WeaponsManage.defaultData);
        this.equipWaponNodeList.forEach(element => {
            const waponsItem = this.weaponsItemList[names[element.node.name]] || this.weaponsItemList[SXZW_WeaponsManage.defaultData[element.node.name]];
            element.updateData(waponsItem);
        })
        this.node.active = false;
    }

    protected onEnable(): void {
        this.equipInfoNode.active = false;
        this.weaponsItemListPlanet.active = true;
        this.weaponItemFloorImage.node.parent.active = false;
    }

    protected onDisable(): void {
        this.closeEquip();
    }

    update(deltaTime: number) {

    }


    public showEquipInfo(wapon: SXZW_WaponsItem, isButton: boolean): void {
        if (this.weaponsItemListPlanet.active) {
            if (wapon.itemLevel > 0) {
                this.currentEquipWapon = wapon;
                this.equipInfoNode.active = true;
                this.equipInfoImage.spriteFrame = wapon.itemImage;
                this.equipButton.active = !wapon.isTopCard
                if (wapon.itemLevel < wapon.levelDatas.length && SXZW_GameManage.EnoughCoin(wapon.levelDatas[wapon.itemLevel].money)) {
                    this.upgeadeButtonLabel.node.parent.active = true;
                    this.upgeadeButtonLabel.string = wapon.levelDatas[wapon.itemLevel].money + "\n升级"
                } else {
                    this.upgeadeButtonLabel.node.parent.active = false;
                }
                this.weaponItemNameLabe.string = wapon.itemName;
                this.weaponItemLvLabel.string = `LV.${wapon.itemLevel}`
                const levelData = wapon.levelDatas[wapon.itemLevel - 1];
                this.weaponItemDamageLabel.string = levelData.damage.toString();
                this.weaponItemPushForceLabel.string = levelData.pushForce.toString();
                if (levelData.damageRange <= 0) {
                    this.weaponItemDamageRangeLabel.string = "-";
                    this.weaponItemDamageRangeSprite.color = new Color(255, 255, 255, 128);
                } else {
                    this.weaponItemDamageRangeLabel.string = levelData.damageRange.toString();
                    this.weaponItemDamageRangeSprite.color = new Color(255, 255, 255, 255);
                }

                SXZW_AudioManage.Instance.playClickEffect();
            } else if (wapon.itemIsVideo && isButton) {
                this.videoUnlock(wapon);
            } else if (!wapon.itemIsVideo) {
                SXZW_GameManage.Instance.showTips(`通过第${wapon.itemUnlockLevel}关解锁`)
            }
        } else if (this.currentEquipWapon) {
            for (let item of this.equipWaponNodeList) {
                if (item === wapon) {
                    item.updateData(this.currentEquipWapon)
                    break;
                }
            }
            this.closeEquip()
            const names = {}
            for (let item of this.equipWaponNodeList) {
                names[item.node.name] = item.itemName
            }
            const json = JSON.stringify(names)
            sys.localStorage.setItem("sxzw_topItems", json)

            SXZW_AudioManage.Instance.playClickEffect();
        }
    }

    public hideEquipInfo(): void {
        this.equipInfoNode.active = false;
    }

    public equip() {
        this.hideEquipInfo();
        this.weaponsItemListPlanet.active = false;
        this.weaponItemFloorImage.spriteFrame = this.currentEquipWapon.itemImage;
        this.weaponItemFloorImage.node.parent.active = true;
        this.node.on(NodeEventType.TOUCH_END, this.closeEquip, this);

        const as = this.weaponsItemTopListPlanet.getComponentsInChildren(Animation);
        as.forEach((a) => {
            a.play();
        })
    }

    public closeEquip() {
        this.weaponsItemListPlanet.active = true;
        this.weaponItemFloorImage.node.parent.active = false;
        this.currentEquipWapon = null;
        this.node.off(NodeEventType.TOUCH_END, this.closeEquip, this);

        const as = this.weaponsItemTopListPlanet.getComponentsInChildren(Animation);
        as.forEach((a) => {
            a.stop();
            a.node.eulerAngles = Vec3.ZERO;
        })
    }

    public upgrade() {
        this.hideEquipInfo();
        this.currentEquipWapon?.upgrade();
        this.currentEquipWapon = null;
    }

    private videoUnlock(waponsItem: SXZW_WaponsItem) {
        if (waponsItem.itemLevel > 0) return;
        Banner.Instance.ShowVideoAd(() => {
            waponsItem.upgrade()
        })
    }

    onDestroy() {
        SXZW_WeaponsManage._instance = null;
    }

}


